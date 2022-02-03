const updatePageInfo = (title, desc) => {
  document.title = title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", desc);
};

export { updatePageInfo };
