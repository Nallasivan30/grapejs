// Admin functionality with Netlify Identity and GrapesJS
let editor = null
let isEditing = false
const grapesjs = window.grapesjs // Declare the grapesjs variable

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Netlify Identity
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.reload()
        })
      } else {
        showAdminControls()
      }
    })

    window.netlifyIdentity.on("logout", () => {
      hideAdminControls()
      document.location.reload()
    })
  }

  // Check if user is already logged in
  const user = window.netlifyIdentity && window.netlifyIdentity.currentUser()
  if (user) {
    showAdminControls()
  }

  // Initialize GrapesJS editor
  initializeEditor()
})

// Show admin controls for authenticated users
function showAdminControls() {
  const adminControls = document.getElementById("adminControls")
  if (adminControls) {
    adminControls.classList.add("show")
  }
}

// Hide admin controls
function hideAdminControls() {
  const adminControls = document.getElementById("adminControls")
  if (adminControls) {
    adminControls.classList.remove("show")
  }
}

// Initialize GrapesJS Editor
function initializeEditor() {
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
  })

  // Add custom commands
  editor.Commands.add("show-layers", {
    getRowEl(editor) {
      return editor.getContainer().closest(".editor-row")
    },
    getLayersEl(row) {
      return row.querySelector(".layers-container")
    },

    run(editor, sender) {
      const lmEl = this.getLayersEl(this.getRowEl(editor))
      lmEl.style.display = ""
    },
    stop(editor, sender) {
      const lmEl = this.getLayersEl(this.getRowEl(editor))
      lmEl.style.display = "none"
    },
  })

  editor.Commands.add("show-styles", {
    getRowEl(editor) {
      return editor.getContainer().closest(".editor-row")
    },
    getStyleEl(row) {
      return row.querySelector(".styles-container")
    },

    run(editor, sender) {
      const smEl = this.getStyleEl(this.getRowEl(editor))
      smEl.style.display = ""
    },
    stop(editor, sender) {
      const smEl = this.getStyleEl(this.getRowEl(editor))
      smEl.style.display = "none"
    },
  })

  editor.Commands.add("show-traits", {
    getRowEl(editor) {
      return editor.getContainer().closest(".editor-row")
    },
    getTraitsEl(row) {
      return row.querySelector(".traits-container")
    },

    run(editor, sender) {
      const tmEl = this.getTraitsEl(this.getRowEl(editor))
      tmEl.style.display = ""
    },
    stop(editor, sender) {
      const tmEl = this.getTraitsEl(this.getRowEl(editor))
      tmEl.style.display = "none"
    },
  })
}

// Start editing mode
function startEditing() {
  // Check if user is authenticated
  const user = window.netlifyIdentity && window.netlifyIdentity.currentUser()
  if (!user) {
    // Open login modal
    window.netlifyIdentity.open()
    return
  }

  if (!editor) {
    console.error("Editor not initialized")
    return
  }

  // Get current page content
  const mainContent = document.getElementById("mainContent")
  if (mainContent) {
    // Set the HTML content in the editor
    editor.setComponents(mainContent.innerHTML)
    editor.setStyle(getPageStyles())
  }

  // Show editor
  const editorEl = document.getElementById("gjs-editor")
  editorEl.classList.add("active")

  // Show save button, hide edit button
  document.querySelector(".edit-btn").style.display = "none"
  document.getElementById("saveBtn").style.display = "inline-block"

  isEditing = true
}

// Save content
function saveContent() {
  if (!editor || !isEditing) return

  // Get the updated HTML and CSS from the editor
  const html = editor.getHtml()
  const css = editor.getCss()

  // Update the main content
  const mainContent = document.getElementById("mainContent")
  if (mainContent) {
    mainContent.innerHTML = html
  }

  // Update styles (you might want to inject CSS into a style tag)
  updatePageStyles(css)

  // Hide editor
  const editorEl = document.getElementById("gjs-editor")
  editorEl.classList.remove("active")

  // Show edit button, hide save button
  document.querySelector(".edit-btn").style.display = "inline-block"
  document.getElementById("saveBtn").style.display = "none"

  isEditing = false

  // Show success message
  alert("Content saved successfully!")
}

// Get current page styles
function getPageStyles() {
  const styleSheets = document.styleSheets
  let styles = ""

  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules
      for (let j = 0; j < rules.length; j++) {
        styles += rules[j].cssText + "\n"
      }
    } catch (e) {
      // Skip external stylesheets due to CORS
      console.log("Skipping external stylesheet")
    }
  }

  return styles
}

// Update page styles
function updatePageStyles(css) {
  // Remove existing dynamic styles
  const existingStyle = document.getElementById("dynamic-styles")
  if (existingStyle) {
    existingStyle.remove()
  }

  // Add new styles
  if (css) {
    const styleEl = document.createElement("style")
    styleEl.id = "dynamic-styles"
    styleEl.textContent = css
    document.head.appendChild(styleEl)
  }
}

// Logout function
function logout() {
  if (window.netlifyIdentity) {
    window.netlifyIdentity.logout()
  }
}

// Handle escape key to exit editing mode
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isEditing) {
    // Hide editor without saving
    const editorEl = document.getElementById("gjs-editor")
    editorEl.classList.remove("active")

    // Show edit button, hide save button
    document.querySelector(".edit-btn").style.display = "inline-block"
    document.getElementById("saveBtn").style.display = "none"

    isEditing = false
  }
})

// Prevent accidental page reload during editing
window.addEventListener("beforeunload", (e) => {
  if (isEditing) {
    e.preventDefault()
    e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
    return e.returnValue
  }
})
