// Admin functionality with Netlify Identity and GrapesJS
let editor = null;
let isEditing = false;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  
  // Initialize Netlify Identity
  if (window.netlifyIdentity) {
    console.log("Netlify Identity found, initializing...");
    
    window.netlifyIdentity.on("init", (user) => {
      console.log("Netlify Identity initialized", user);
      
      if (!user) {
        console.log("No user logged in, setting up login handler");
        window.netlifyIdentity.on("login", () => {
          console.log("User logged in, reloading page");
          document.location.reload();
        });
      } else {
        console.log("User already logged in, showing admin controls");
        showAdminControls();
      }
    });

    window.netlifyIdentity.on("logout", () => {
      console.log("User logged out");
      hideAdminControls();
      document.location.reload();
    });
  } else {
    console.error("Netlify Identity not found!");
  }

  // Check if user is already logged in
  const user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
  if (user) {
    console.log("Found logged in user on load", user);
    showAdminControls();
  }

  // Initialize GrapesJS editor only if the editor container exists
  if (document.getElementById("gjs-editor")) {
    console.log("Initializing GrapesJS editor");
    initializeEditor();
  } else {
    console.error("GrapesJS editor container not found");
  }
});

// Show admin controls for authenticated users
function showAdminControls() {
  console.log("Attempting to show admin controls...");
  const adminControls = document.getElementById("adminControls");
  if (adminControls) {
    console.log("Admin controls element found, adding 'show' class");
    adminControls.classList.add("show");
  } else {
    console.error("Admin controls element not found!");
  }
}

// Hide admin controls
function hideAdminControls() {
  console.log("Hiding admin controls");
  const adminControls = document.getElementById("adminControls");
  if (adminControls) {
    adminControls.classList.remove("show");
  }
}

// Initialize GrapesJS Editor
function initializeEditor() {
  console.log("Initializing GrapesJS editor instance");
  
  if (!window.grapesjs) {
    console.error("GrapesJS not loaded!");
    return;
  }

  editor = grapesjs.init({
    container: "#gjs-editor",
    height: "100vh",
    width: "100%",
    storageManager: {
      type: "local",
      autosave: true,
      autoload: true,
      stepsBeforeSave: 1,
    },
    deviceManager: {
      devices: [
        {
          name: "Desktop",
          width: "",
        },
        {
          name: "Tablet",
          width: "768px",
          widthMedia: "992px",
        },
        {
          name: "Mobile",
          width: "320px",
          widthMedia: "768px",
        },
      ],
    },
    panels: {
      defaults: [
        {
          id: "layers",
          el: ".panel__right",
          resizable: {
            maxDim: 350,
            minDim: 200,
            tc: 0,
            cl: 1,
            cr: 0,
            bc: 0,
            keyWidth: "flex-basis",
          },
        },
        {
          id: "panel-switcher",
          el: ".panel__switcher",
          buttons: [
            {
              id: "show-layers",
              active: true,
              label: "Layers",
              command: "show-layers",
              togglable: false,
            },
            {
              id: "show-style",
              active: true,
              label: "Styles",
              command: "show-styles",
              togglable: false,
            },
            {
              id: "show-traits",
              active: true,
              label: "Settings",
              command: "show-traits",
              togglable: false,
            },
          ],
        },
      ],
    },
    layerManager: {
      appendTo: ".layers-container",
    },
    styleManager: {
      appendTo: ".styles-container",
      sectors: [
        {
          name: "Dimension",
          open: false,
          buildProps: ["width", "min-height", "padding"],
          properties: [
            {
              type: "integer",
              name: "The width",
              property: "width",
              units: ["px", "%"],
              defaults: "auto",
              min: 0,
            },
          ],
        },
        {
          name: "Extra",
          open: false,
          buildProps: ["background-color", "box-shadow", "custom-prop"],
          properties: [
            {
              id: "custom-prop",
              name: "Custom Label",
              property: "font-size",
              type: "select",
              defaults: "32px",
              options: [
                { value: "12px", name: "Tiny" },
                { value: "18px", name: "Medium" },
                { value: "32px", name: "Big" },
              ],
            },
          ],
        },
      ],
    },
    traitManager: {
      appendTo: ".traits-container",
    },
    selectorManager: {
      appendTo: ".styles-container",
    },
    richTextEditor: {
      disable: false,
    },
    assetManager: {
      embedAsBase64: true,
    },
    canvas: {
      styles: ["https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"],
    },
  });

  // Add custom commands
  editor.Commands.add("show-layers", {
    getRowEl(editor) {
      return editor.getContainer().closest(".editor-row");
    },
    getLayersEl(row) {
      return row.querySelector(".layers-container");
    },

    run(editor, sender) {
      const lmEl = this.getLayersEl(this.getRowEl(editor));
      lmEl.style.display = "";
    },
    stop(editor, sender) {
      const lmEl = this.getLayersEl(this.getRowEl(editor));
      lmEl.style.display = "none";
    },
  });

  editor.Commands.add("show-styles", {
    getRowEl(editor) {
      return editor.getContainer().closest(".editor-row");
    },
    getStyleEl(row) {
      return row.querySelector(".styles-container");
    },

    run(editor, sender) {
      const smEl = this.getStyleEl(this.getRowEl(editor));
      smEl.style.display = "";
    },
    stop(editor, sender) {
      const smEl = this.getStyleEl(this.getRowEl(editor));
      smEl.style.display = "none";
    },
  });

  editor.Commands.add("show-traits", {
    getRowEl(editor) {
      return editor.getContainer().closest(".editor-row");
    },
    getTraitsEl(row) {
      return row.querySelector(".traits-container");
    },

    run(editor, sender) {
      const tmEl = this.getTraitsEl(this.getRowEl(editor));
      tmEl.style.display = "";
    },
    stop(editor, sender) {
      const tmEl = this.getTraitsEl(this.getRowEl(editor));
      tmEl.style.display = "none";
    },
  });

  console.log("GrapesJS editor initialized successfully");
}

// Start editing mode
function startEditing() {
  console.log("Attempting to start editing...");
  
  // Check if user is authenticated
  const user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
  if (!user) {
    console.log("No user logged in, opening login modal");
    window.netlifyIdentity.open();
    return;
  }

  if (!editor) {
    console.error("Editor not initialized, attempting to initialize");
    initializeEditor();
    return;
  }

  // Get current page content
  const mainContent = document.getElementById("mainContent");
  if (mainContent) {
    console.log("Setting editor content from mainContent");
    editor.setComponents(mainContent.innerHTML);
    editor.setStyle(getPageStyles());
  } else {
    console.error("mainContent element not found");
  }

  // Show editor
  const editorEl = document.getElementById("gjs-editor");
  if (editorEl) {
    console.log("Showing editor");
    editorEl.classList.add("active");
  } else {
    console.error("Editor element not found");
  }

  // Show save button, hide edit button
  const editBtn = document.querySelector(".edit-btn");
  const saveBtn = document.getElementById("saveBtn");
  
  if (editBtn) {
    console.log("Hiding edit button");
    editBtn.style.display = "none";
  }
  
  if (saveBtn) {
    console.log("Showing save button");
    saveBtn.style.display = "inline-block";
  }

  isEditing = true;
  
  // Refresh the editor to ensure proper rendering
  setTimeout(() => {
    if (editor) {
      console.log("Refreshing editor");
      editor.refresh();
    }
  }, 100);
}

// Save content
function saveContent() {
  console.log("Attempting to save content");
  
  if (!editor || !isEditing) {
    console.error("Cannot save - no editor or not in editing mode");
    return;
  }

  // Get the updated HTML and CSS from the editor
  const html = editor.getHtml();
  const css = editor.getCss();
  console.log("Got updated content from editor");

  // Update the main content
  const mainContent = document.getElementById("mainContent");
  if (mainContent) {
    console.log("Updating main content");
    mainContent.innerHTML = html;
  }

  // Update styles
  updatePageStyles(css);

  // Hide editor
  const editorEl = document.getElementById("gjs-editor");
  if (editorEl) {
    console.log("Hiding editor");
    editorEl.classList.remove("active");
  }

  // Show edit button, hide save button
  const editBtn = document.querySelector(".edit-btn");
  const saveBtn = document.getElementById("saveBtn");
  
  if (editBtn) {
    console.log("Showing edit button");
    editBtn.style.display = "inline-block";
  }
  
  if (saveBtn) {
    console.log("Hiding save button");
    saveBtn.style.display = "none";
  }

  isEditing = false;

  // Show success message
  alert("Content saved successfully!");
  console.log("Content saved successfully");
}

// Get current page styles
function getPageStyles() {
  console.log("Getting page styles");
  const styleSheets = document.styleSheets;
  let styles = "";

  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      for (let j = 0; j < rules.length; j++) {
        styles += rules[j].cssText + "\n";
      }
    } catch (e) {
      console.log("Skipping external stylesheet due to CORS");
    }
  }

  return styles;
}

// Update page styles
function updatePageStyles(css) {
  console.log("Updating page styles");
  
  // Remove existing dynamic styles
  const existingStyle = document.getElementById("dynamic-styles");
  if (existingStyle) {
    console.log("Removing existing dynamic styles");
    existingStyle.remove();
  }

  // Add new styles
  if (css) {
    console.log("Adding new dynamic styles");
    const styleEl = document.createElement("style");
    styleEl.id = "dynamic-styles";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }
}

// Logout function
function logout() {
  console.log("Logging out");
  if (window.netlifyIdentity) {
    window.netlifyIdentity.logout();
  }
}

// Handle escape key to exit editing mode
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isEditing) {
    console.log("Escape key pressed, exiting edit mode");
    
    // Hide editor without saving
    const editorEl = document.getElementById("gjs-editor");
    if (editorEl) {
      editorEl.classList.remove("active");
    }

    // Show edit button, hide save button
    const editBtn = document.querySelector(".edit-btn");
    const saveBtn = document.getElementById("saveBtn");
    
    if (editBtn) editBtn.style.display = "inline-block";
    if (saveBtn) saveBtn.style.display = "none";

    isEditing = false;
  }
});

// Prevent accidental page reload during editing
window.addEventListener("beforeunload", (e) => {
  if (isEditing) {
    console.log("Warning about unsaved changes");
    e.preventDefault();
    e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    return e.returnValue;
  }
});