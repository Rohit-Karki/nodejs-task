const defineAdminAbilities = (can, cannot) => {
  can("manage", "all");
  can("edit within 5 hrs", "Post");

  can("assign", "Editor");
  can("edit", "Post");
  can("delete", "Post");
  can("add", "Tag");
  can("view", "Post");
};
const defineEditorAbilities = (can, cannot) => {
  can("edit", "Post");
  can("view", "Post");
  
  can("add", "Tag");
  cannot("delete", "Post");
  cannot("assign", "Editor");
};
const defineViewerAbilities = (can, cannot) => {
  can("view", "Post");
  cannot("edit", "Post");
  cannot("add", "Tag");
  cannot("delete", "Post");
  cannot("assign", "Editor");
};

module.exports = {
  defineEditorAbilities,
  defineViewerAbilities,
  defineAdminAbilities,
};
