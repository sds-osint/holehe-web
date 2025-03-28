// Extracted JavaScript logic from index.html
function toggleSection(id, titleEl) {
    const section = document.getElementById(id);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    titleEl.parentElement.classList.toggle('expanded');
  }
  
  async function checkEmail() {
    const email = document.getElementById('email').value;
    const errorBox = document.getElementById('error');
    const rawBox = document.getElementById('raw');
    const progress = document.getElementById('progress');
    const checkBtn = document.getElementById('checkBtn');
    const timing = document.getElementById('timing');
  
    if (!email || !email.includes('@')) {
      errorBox.textContent = "Please enter a valid email address.";
      errorBox.style.display = 'block';
      return;
    }
  
    const sectionIds = ['used', 'not-used', 'rate-limited', 'error'];
    sectionIds.forEach(id => {
      const section = document.getElementById(`section-${id}`);
      section.innerHTML = '';
    });
  
    errorBox.style.display = 'none';
    rawBox.style.display = 'none';
    progress.style.display = 'block';
    checkBtn.disabled = true;
  
    const start = performance.now();
  
    try {
      const res = await fetch('/check', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email})
      });
  
      const data = await res.json();
      progress.style.display = 'none';
      checkBtn.disabled = false;
  
      if (res.ok) {
        const map = {
          'used': 'section-used',
          'not used': 'section-not-used',
          'rate limited': 'section-rate-limited',
          'error': 'section-error'
        };
  
        Object.entries(map).forEach(([key, sectionId]) => {
          const section = document.getElementById(sectionId);
          const items = (data.results[key] || []).filter(s => !s.includes("[+") && !s.includes("[-") && !s.includes("[x") && !s.includes("[!"));
          if (items.length > 0) {
            items.forEach(service => {
              const line = document.createElement('div');
              line.textContent = service;
              section.appendChild(line);
            });
          } else {
            const empty = document.createElement('div');
            empty.textContent = "None";
            section.appendChild(empty);
          }
        });
  
        rawBox.textContent = data.raw_output;
  
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        timing.textContent = `Scan completed in ${duration} seconds.`;
      } else {
        errorBox.textContent = "Error: " + data.detail;
        errorBox.style.display = 'block';
      }
    } catch (err) {
      progress.style.display = 'none';
      checkBtn.disabled = false;
      errorBox.textContent = "Unexpected Error: " + err.message;
      errorBox.style.display = 'block';
    }
  }
  
  function toggleRaw() {
    const raw = document.getElementById('raw');
    raw.style.display = raw.style.display === 'none' ? 'block' : 'none';
  }
  
  function copyRawOutput() {
    const raw = document.getElementById('raw');
    const text = raw.innerText || raw.textContent;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('Raw output copied to clipboard!');
    } catch (err) {
      alert('Failed to copy raw output.');
    }
    document.body.removeChild(textarea);
  }
  
  function exportToCSV() {
    const csvRows = ["Category,Service"];
    const map = {
      'used': 'section-used',
      'not used': 'section-not-used',
      'rate limited': 'section-rate-limited',
      'error': 'section-error'
    };
    Object.entries(map).forEach(([category, sectionId]) => {
      const section = document.getElementById(sectionId);
      const rows = section.querySelectorAll('div');
      rows.forEach(row => {
        if (row.textContent !== "None") {
          csvRows.push(`${category},${row.textContent}`);
        }
      });
    });
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holehe_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  }