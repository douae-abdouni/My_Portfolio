(function(){
  const tableBody = document.querySelector('#messagesTable tbody');
  const status = document.getElementById('status');
  const refreshBtn = document.getElementById('refresh');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const pageInfo = document.getElementById('pageInfo');

  let page = 1; const limit = 20; let total = 0;

  async function fetchPage(p){
    status.textContent = 'Loading...';
    try{
      const resp = await fetch(`/api/messages?page=${p}&limit=${limit}`, { credentials: 'same-origin' });
      if (!resp.ok) throw new Error('Fetch failed');
      const data = await resp.json();
      total = data.total || 0; page = data.page || 1;
      renderRows(data.messages || []);
      pageInfo.textContent = `Page ${page} — ${total} total`;
      status.textContent = '';
    }catch(err){
      status.textContent = 'Error loading messages';
      console.error(err);
    }
  }

  function renderRows(rows){
    tableBody.innerHTML = '';
    if (!rows.length) {
      tableBody.innerHTML = '<tr><td colspan="7">No messages</td></tr>';
      return;
    }

    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.subject || '')}</td>
        <td class="message-preview">${escapeHtml(r.message)}</td>
        <td>${escapeHtml(r.created_at)}</td>
        <td>
          <button data-id="${r.id}" class="action-delete">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // attach delete handlers
    tableBody.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (!confirm('Delete message #' + id + '?')) return;
        try{
          const resp = await fetch('/api/messages/' + id, { method: 'DELETE' });
          if (!resp.ok) throw new Error('Delete failed');
          fetchPage(page);
        }catch(err){
          alert('Failed to delete');
          console.error(err);
        }
      });
    });
  }

  function escapeHtml(s){
    if (!s) return '';
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  refreshBtn.addEventListener('click', () => fetchPage(page));
  prevBtn.addEventListener('click', () => { if (page>1) fetchPage(page-1); });
  nextBtn.addEventListener('click', () => { if (page*limit < total) fetchPage(page+1); });

  // initial load
  fetchPage(1);
})();