const fs = require('fs');
let code = fs.readFileSync('src/components/os/MissionControl.tsx', 'utf8');

const oldSubmit = `  const submitMission = async () => {
    if (!prompt.trim()) return;
    try {
      await fetch('/api/autonomic/mission/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, strategy: "AUTO" })
      });
      setPrompt("");
    } catch (e) {
      console.error(e);
    }
  };`;

const newSubmit = `  const submitMission = async () => {
    if (!prompt.trim()) return;
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: prompt, description: "Auto-dispatched via Mission Control" })
      });
      setPrompt("");
    } catch (e) {
      console.error(e);
    }
  };`;

if (!code.includes(oldSubmit)) {
  console.log("oldSubmit not found!");
} else {
  code = code.replace(oldSubmit, newSubmit);
  fs.writeFileSync('src/components/os/MissionControl.tsx', code);
}
