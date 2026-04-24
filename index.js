const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const kicks = [];
const notifications = [];
const users = [];

app.post("/kick", (req, res) => {
  const log = {
    hwid: req.body.hwid || null,
    username: req.body.username || null,
    reason: req.body.reason,
    time: Date.now(),
    handled: false
  };

  kicks.push(log);

  console.log("🚨 KICK LOG:", log);

  res.json({
    success: true,
    message: "Kick logged"
  });
});

app.post("/kick/handled", (req, res) => {
  const hwid = req.body.hwid;
  const username = req.body.username;

  for (let log of kicks) {
    if (
      (hwid && log.hwid === hwid) ||
      (username && log.username === username)
    ) {
      log.handled = true;
    }
  }

  res.json({
    success: true,
    message: "Marked as handled"
  });
});

app.get("/kicks", (req, res) => {
  res.json({
    success: true,
    data: kicks
  });
});

app.get("/kicks/clear", (req, res) => {
  kicks.length = 0;

  res.json({
    success: true,
    message: "Kicks cleared"
  });
});

app.post("/notify", (req, res) => {
  const log = {
    text: req.body.text,
    hwid: req.body.hwid || null,
    username: req.body.username || null,
    time: Date.now(),
    readBy: []
  };

  notifications.push(log);

  console.log("📢 NOTIFY LOG:", log);

  res.json({
    success: true,
    message: "Notification logged"
  });
});

app.get("/notify", (req, res) => {
  const hwid = req.query.hwid;
  const username = req.query.username;

  const filtered = notifications.filter(log => {
    return (
      (!log.hwid && !log.username) ||
      (hwid && log.hwid === hwid) ||
      (username && log.username === username)
    );
  });

  const unread = filtered.filter(log => {
    return !log.readBy.includes(hwid || username);
  });

  res.json({
    success: true,
    data: unread
  });
});

app.post("/notify/read", (req, res) => {
  const time = req.body.time;
  const hwid = req.body.hwid;
  const username = req.body.username;

  const readerId = hwid || username;

  for (let log of notifications) {
    if (log.time === time) {
      if (!log.readBy.includes(readerId)) {
        log.readBy.push(readerId);
      }
    }
  }

  res.json({
    success: true,
    message: "Notification marked as read for user"
  });
});

app.get("/notify/clear", (req, res) => {
  notifications.length = 0;

  res.json({
    success: true,
    message: "Notifications cleared"
  });
});

app.post("/user", (req, res) => {
  const user = {
    hwid: req.body.hwid,
    username: req.body.username,
    email: req.body.email || null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  users.push(user);

  console.log("👤 USER ADDED:", user);

  res.json({
    success: true,
    message: "User added successfully"
  });
});

app.get("/user", (req, res) => {
  const hwid = req.query.hwid;
  const username = req.query.username;

  const user = users.find(u => u.hwid === hwid || u.username === username);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// New route to serve the users as a table
app.get("/users", (req, res) => {
  const userCount = users.length;  // Get the count of all users

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User List</title>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            .count {
                margin-top: 20px;
                font-size: 16px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>Users</h1>
        <table>
            <tr>
                <th>Username</th>
            </tr>
  `;

  // Loop through users and add each to the table
  users.forEach(user => {
    html += `<tr><td>${user.username}</td></tr>`;
  });

  // Add the user count at the bottom of the page
  html += `
        </table>
        <div class="count">Total Users: ${userCount}</div>
    </body>
    </html>
  `;

  res.send(html);
});

app.post("/user/update", (req, res) => {
  const hwid = req.body.hwid;
  const username = req.body.username;
  const updatedData = req.body;

  const userIndex = users.findIndex(u => u.hwid === hwid || u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  users[userIndex] = { ...users[userIndex], ...updatedData, updatedAt: Date.now() };

  console.log("👤 USER UPDATED:", users[userIndex]);

  res.json({
    success: true,
    message: "User info updated"
  });
});

app.delete("/user", (req, res) => {
  const hwid = req.body.hwid;
  const username = req.body.username;

  const userIndex = users.findIndex(u => u.hwid === hwid || u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  users.splice(userIndex, 1);

  console.log("👤 USER DELETED:", { hwid, username });

  res.json({
    success: true,
    message: "User deleted"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
