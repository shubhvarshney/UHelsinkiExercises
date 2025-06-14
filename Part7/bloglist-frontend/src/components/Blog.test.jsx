import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Blog from "./Blog";

test("renders only the title and author of the blog by default", () => {
  const blog = {
    title: "Sample Blog",
    author: "Joe Johnson",
    url: "https://sample.com",
    likes: 5,
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent(blog.title);
  expect(div).toHaveTextContent(blog.author);
  expect(div).not.toHaveTextContent(blog.url);
  expect(div).not.toHaveTextContent(blog.likes);
});

test("renders the url and likes once the button controlling the shown details has been clicked", async () => {
  const blog = {
    title: "Sample Blog",
    author: "Joe Johnson",
    url: "https://sample.com",
    likes: 5,
    user: { id: "foo", username: "shubhvarshney", name: "Shubh Varshney" },
  };

  const { container } = render(<Blog blog={blog} user={blog.user} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const div = container.querySelector(".blog");
  expect(div).toHaveTextContent(blog.url);
  expect(div).toHaveTextContent(blog.likes);
});

test("clicking the like button twice calls event handler twice", async () => {
  const blog = {
    title: "Sample Blog",
    author: "Joe Johnson",
    url: "https://sample.com",
    likes: 5,
    user: { id: "foo", username: "shubhvarshney", name: "Shubh Varshney" },
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} user={blog.user} updateBlog={mockHandler} />);

  const user = userEvent.setup();
  const expandButton = screen.getByText("view");
  await user.click(expandButton);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
