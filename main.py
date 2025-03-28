from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
import asyncio
import os

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve HTML frontend
@app.get("/")
def read_index():
    return FileResponse(os.path.join("static", "index.html"))

class EmailRequest(BaseModel):
    email: EmailStr

@app.post("/check")
async def check_email(data: EmailRequest):
    try:
        proc = await asyncio.create_subprocess_exec(
            "holehe", data.email,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            raise HTTPException(status_code=500, detail=stderr.decode().strip())

        output_lines = stdout.decode().strip().split("\n")
        categories = {
            "used": [],
            "not used": [],
            "rate limited": [],
            "error": []
        }

        statuses = {
            "[+]": "used",
            "[-]": "not used",
            "[x]": "rate limited",
            "[!]": "error"
        }

        for line in output_lines:
            for symbol, status in statuses.items():
                if line.strip().startswith(symbol):
                    service = line.split(symbol)[-1].strip()
                    categories[status].append(service)
                    break

        return {
            "email": data.email,
            "results": categories,
            "raw_output": stdout.decode()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))