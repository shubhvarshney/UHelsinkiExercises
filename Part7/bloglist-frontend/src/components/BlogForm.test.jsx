import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("submitting the form calls the event handler once with the right details", async () => {
  const blog = {
    title: "Sample Blog",
    author: "Joe Johnson",
    url: "https://sample.com",
  };

  const mockHandler = vi.fn();

  const { container } = render(<BlogForm createBlog={mockHandler} />);

  const user = userEvent.setup();

  const titleInput = container.querySelector("#blog-title");
  await user.type(titleInput, blog.title);
  const authorInput = container.querySelector("#blog-author");
  await user.type(authorInput, blog.author);
  const urlInput = container.querySelector("#blog-url");
  await user.type(urlInput, blog.url);
  const button = screen.getByText("create");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0].title).toBe(blog.title);
  expect(mockHandler.mock.calls[0][0].author).toBe(blog.author);
  expect(mockHandler.mock.calls[0][0].url).toBe(blog.url);
});
