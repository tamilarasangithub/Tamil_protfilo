const fs = require('fs');

const transcriptPath = 'C:\\Users\\tamil\\.gemini\\antigravity\\brain\\86757859-adb9-4c62-af4b-5e822698ca62\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

for (const line of lines) {
  if (line.includes('"TargetFile":"\\"c:\\\\\\\\Users\\\\\\\\tamil\\\\\\\\Downloads\\\\\\\\new protfilo\\\\\\\\src\\\\\\\\index.css\\""')) {
    try {
      const parsed = JSON.parse(line);
      const toolCalls = parsed.tool_calls || [];
      for (const call of toolCalls) {
        if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
          if (call.args.TargetFile.includes('index.css')) {
            console.log('--- MANUAL CSS EDIT FOUND ---');
            console.log('Description:', call.args.Description);
            console.log('Chunks:', JSON.parse(call.args.ReplacementChunks));
          }
        }
      }
    } catch (e) {}
  }
}
