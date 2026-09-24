const path = require('node:path');
const net = require('node:net');

function settings(root, env = process.env) {
  root = path.resolve(root);
  const test = env.LAB_MODE === 'test';
  if (env.LAB_MODE && !['test', 'development'].includes(env.LAB_MODE)) throw Error('LAB_MODE must be development or test.');
  const offset = Number(env.LAB_PORT_OFFSET || 0) + (test ? 1000 : 0);
  if (!Number.isInteger(offset) || offset < 0 || offset > 40000) throw Error('LAB_PORT_OFFSET must be an integer from 0 to 40000.');
  const ports = { web: 5173 + offset, database: 9000 + offset, auth: 9099 + offset, hub: 4400 + offset, logging: 4500 + offset };
  return {
    mode: test ? 'test' : 'development', ports,
    // Each checkout owns its state. Automated tests never restore a developer's game.
    stateDir: path.join(root, '.player-lab-work', (test ? 'test' : 'development') + '-' + offset),
    project: test ? 'demo-mystery-test' : 'demo-mystery-lab',
    origin: 'http://127.0.0.1:' + ports.web,
    persist: !test
  };
}

async function assertPortsAvailable(ports) {
  // Hold every reservation until all are checked, then release before emulator launch.
  const servers = [];
  try {
    for (const [name, port] of Object.entries(ports)) {
      const server = net.createServer();
      servers.push(server);
      await new Promise((resolve, reject) => {
        server.once('error', () => reject(Error(`${name} port ${port} is occupied. Stop that lab or set LAB_PORT_OFFSET to a different value.`)));
        server.listen(port, '127.0.0.1', resolve);
      });
    }
  } finally {
    await Promise.all(servers.filter(s => s.listening).map(s => new Promise(resolve => s.close(resolve))));
  }
}
module.exports = { settings, assertPortsAvailable };
