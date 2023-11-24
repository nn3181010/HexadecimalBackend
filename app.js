const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Endpoint to fetch and combine user and post data
app.get("/v1/users", async (req, res) => {
  try {
    const [usersResponse, postsResponse] = await Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/users"),
      axios.get("https://jsonplaceholder.typicode.com/posts"),
    ]);

    const users = usersResponse.data;
    const posts = postsResponse.data;

    // Combine user and post data based on userId
    const combinedData = users.map((user) => ({
      ...user,
      posts: posts.filter((post) => post.userId === user.id),
    }));

    // Check for search query and filter results
    const searchText = req.query.searchText;
    const filteredData = searchText
      ? combinedData.filter((user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase())
        )
      : combinedData;

    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





import {useState, useEffect} from 'react'

function App() {
  const [users, setUsers] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/v1/users?searchText=${searchText}`)
        setUsers(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [searchText])

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Posts</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <ul>
                  {user.posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App

