const User = ({ user }) => {
  if (user) {
    return (
      <div>
        <h1>{user.name}</h1>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map((b) => (
            <li key={b.id}>{b.title}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default User;
