const { randomUUID } = require('node:crypto');
const { Server } = require('@modelcontextprotocol/sdk/server');
const { createMcpExpressApp } = require('@modelcontextprotocol/sdk/server/express.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { runImpactedTests } = require('./test-runner');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
require('dotenv').config();

const PORT = Number(process.env.MODEL_CONTEXT_SERVER_PORT || 4567);
const REPO_NAME = process.env.GITHUB_REPOSITORY || 'thrive-automation';
const APP_NAME = 'thrive-automation-mcp-pr-review';

function createReviewServer() {
  const server = new Server(
    { name: APP_NAME, version: '1.0.0' },
    {
      capabilities: {
        tools: {},
        tasks: {
          requests: {
            tools: { call: {} },
          },
        },
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'run_impacted_smoke_tests',
        description: 'Run impacted smoke tests for the current pull request.',
        inputSchema: {
          type: 'object',
          properties: {
            prNumber: { type: 'integer' },
            repository: { type: 'string' },
            commitSha: { type: 'string' },
          },
          required: ['prNumber', 'repository'],
        },
        execution: { taskSupport: 'none' },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    if (name !== 'run_impacted_smoke_tests') {
      throw new Error(`Unsupported tool request: ${name}`);
    }

    const prNumber = args.prNumber;
    const repository = args.repository || REPO_NAME;
    const commitSha = args.commitSha || process.env.GITHUB_SHA || '';

    const result = await runImpactedTests({
      prNumber,
      repository,
      commitSha,
      reportOnly: true,
      skipAllure: true,
    });

    return {
      result: {
        status: result.exitCode === 0 ? 'passed' : 'failed',
        prNumber,
        repository,
        selectedTests: result.selectedTests,
        changedFiles: result.changedFiles,
        summary: result.summary,
        allureReportPath: 'allure-report',
      },
    };
  });

  return server;
}

const app = createMcpExpressApp();
const transports = {};

const isInitializeRequest = (body) => {
  return typeof body === 'object' && body !== null && body.method === 'initialize';
};

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];

  try {
    let transport;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          transports[sid] = transport;
          console.log(`MCP session initialized: ${sid}`);
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          delete transports[sid];
          console.log(`MCP session closed: ${sid}`);
        }
      };

      const server = createReviewServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: Missing MCP session or initialize payload.' },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP request error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

app.listen(PORT, () => {
  console.log(`MCP server is listening on http://localhost:${PORT}/mcp`);
  console.log('Use the run_impacted_smoke_tests tool to start selective Playwright execution.');
});
