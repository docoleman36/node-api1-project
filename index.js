const db = require('./data/db');

const express = require('express');

const server = express();

server.listen(4000, () => {
  console.log('=== server is listening on port 4000 ===');
});

server.use(express.json());

// Get request 
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.satus(500).json({ success: false, err: "The users information could not be retrieved." });
    })
})

// Get user by id 
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err })
    })
})

// Post 
server.post("/api/users", (req, res) => {
  const userInfo = req.body;

  if (!userInfo.name || !userInfo.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(userInfo)
      .then(user => {
        res.status(201).json({ success: true, user });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  }
});

// Delete
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(user => {
      if (user) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "The user could not be removed" });
      }
    })
})

// Put
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;

  const userInfo = req.body;

  if (!userInfo.name || !userInfo.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, userInfo)
      .then(user => {
        if (!user) {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        } else if (user) {
          db.findById(id)
            .then(newUser => {
              res.status(200).json(newUser);
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: "The user information could not be modified." });
            });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  }
});

