let cargos = JSON.parse(localStorage.getItem('cargos')) || [];

function renderCargos() {
  const table = document.getElementById('cargo-table');
  table.innerHTML = '';
  cargos.forEach((cargo, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${cargo.direction}</td>
      <td>${cargo.unit}</td>
      <td>${cargo.status}</td>
      <td>${cargo.shippers.map(s => `#${s.id} - ${formatDatetime(s.datetime)}`).join('<br>')}</td>
      <td>${cargo.receivers.map(r => `#${r.id} - ${formatDatetime(r.datetime)}`).join('<br>')}</td>
      <td>${cargo.notes}</td>
      <td>
        <button onclick="editCargo(${index})">Edit</button>
        <button onclick="copyCargo(${index})">Copy</button>
        <button onclick="deleteCargo(${index})">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
  localStorage.setItem('cargos', JSON.stringify(cargos));
}

function formatDatetime(datetime) {
  return datetime.replace('T', ' ');
}

function addShipper() {
  const id = document.getElementById('shipper-id').value;
  const datetime = document.getElementById('shipper-datetime').value;
  if (id && datetime) {
    const list = document.getElementById('shippers-list');
    const item = document.createElement('li');
    item.textContent = `#${id} - ${formatDatetime(datetime)}`;
    item.dataset.id = id;
    item.dataset.datetime = datetime;
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-item';
    deleteBtn.onclick = () => item.remove();
    item.appendChild(deleteBtn);
    list.appendChild(item);
    document.getElementById('shipper-id').value = '';
    document.getElementById('shipper-datetime').value = '';
  }
}

function addReceiver() {
  const id = document.getElementById('receiver-id').value;
  const datetime = document.getElementById('receiver-datetime').value;
  if (id && datetime) {
    const list = document.getElementById('receivers-list');
    const item = document.createElement('li');
    item.textContent = `#${id} - ${formatDatetime(datetime)}`;
    item.dataset.id = id;
    item.dataset.datetime = datetime;
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-item';
    deleteBtn.onclick = () => item.remove();
    item.appendChild(deleteBtn);
    list.appendChild(item);
    document.getElementById('receiver-id').value = '';
    document.getElementById('receiver-datetime').value = '';
  }
}

function clearList(listId) {
  document.getElementById(listId).innerHTML = '';
}

document.getElementById('cargo-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const direction = document.getElementById('direction').value;
  const unit = document.getElementById('unit').value;
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value;

  const shippers = Array.from(document.getElementById('shippers-list').children).map(item => ({
    id: item.dataset.id,
    datetime: item.dataset.datetime
  }));

  const receivers = Array.from(document.getElementById('receivers-list').children).map(item => ({
    id: item.dataset.id,
    datetime: item.dataset.datetime
  }));

  cargos.push({ direction, unit, status, shippers, receivers, notes });
  clearList('shippers-list');
  clearList('receivers-list');
  document.getElementById('cargo-form').reset();
  renderCargos();
});

function editCargo(index) {
  const cargo = cargos[index];

  document.getElementById('direction').value = cargo.direction;
  document.getElementById('unit').value = cargo.unit;
  document.getElementById('status').value = cargo.status;
  document.getElementById('notes').value = cargo.notes;

  clearList('shippers-list');
  clearList('receivers-list');

  cargo.shippers.forEach(shipper => {
    const item = document.createElement('li');
    item.textContent = `#${shipper.id} - ${formatDatetime(shipper.datetime)}`;
    item.dataset.id = shipper.id;
    item.dataset.datetime = shipper.datetime;
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-item';
    deleteBtn.onclick = () => item.remove();
    item.appendChild(deleteBtn);
    document.getElementById('shippers-list').appendChild(item);
  });

  cargo.receivers.forEach(receiver => {
    const item = document.createElement('li');
    item.textContent = `#${receiver.id} - ${formatDatetime(receiver.datetime)}`;
    item.dataset.id = receiver.id;
    item.dataset.datetime = receiver.datetime;
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'delete-item';
    deleteBtn.onclick = () => item.remove();
    item.appendChild(deleteBtn);
    document.getElementById('receivers-list').appendChild(item);
  });

  cargos.splice(index, 1);
  renderCargos();
}

function deleteCargo(index) {
  cargos.splice(index, 1);
  renderCargos();
}

function copyCargo(index) {
  const cargo = cargos[index];
  const text = `
    ${cargo.direction}
    ${cargo.unit} - ${cargo.status}
    ${cargo.shippers.map(s => `Pick Up #${s.id} - ${formatDatetime(s.datetime)}`).join('\n')}
    ${cargo.receivers.map(r => `Delivery #${r.id} - ${formatDatetime(r.datetime)}`).join('\n')}
  `;
  navigator.clipboard.writeText(text.trim());
  alert('Cargo details copied to clipboard!');
}

function copyAllCargos() {
  const text = cargos.map(cargo => `
    ${cargo.direction}
    ${cargo.unit} - ${cargo.status}
    ${cargo.shippers.map(s => `Pick Up #${s.id} - ${formatDatetime(s.datetime)}`).join('\n')}
    ${cargo.receivers.map(r => `Delivery #${r.id} - ${formatDatetime(r.datetime)}`).join('\n')}
  `).join('\n\n');
  navigator.clipboard.writeText(text.trim());
  alert('All cargo details copied to clipboard!');
}

renderCargos();