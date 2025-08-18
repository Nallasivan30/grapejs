// Admin functionality for GrapesJS content editing
let editor = null
let isEditing = false
const grapesjs = window.grapesjs // Declare the grapesjs variable

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("  Admin script loaded")

  // Initialize Netlify Identity
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      console.log("  Netlify Identity initialized, user:", user)
      checkAuthStatus()
    })

    window.netlifyIdentity.on("login", (user) => {
      console.log("  User logged in:", user)
      showAdminControls()
    })

    window.netlifyIdentity.on("logout", () => {
      console.log("  User logged out")
      hideAdminControls()
    })

    // Initialize the widget
    window.netlifyIdentity.init()
  } else {
    console.error("  Netlify Identity widget not loaded")
  }

  // Initialize GrapesJS editor (hidden by default)
  initializeEditor()
})

function checkAuthStatus() {
  const user = window.netlifyIdentity && window.netlifyIdentity.currentUser()
  console.log("  Checking auth status, current user:", user)

  const authButton = document.getElementById("authButton")

  if (user) {
    showAdminControls()
    if (authButton) {
      authButton.textContent = "Logout"
      authButton.style.color = "#e74c3c"
    }
  } else {
    hideAdminControls()
    if (authButton) {
      authButton.textContent = "Login"
      authButton.style.color = ""
    }
    // Show login modal for admin access
    if (window.location.hash === "#admin") {
      window.netlifyIdentity.open()
    }
  }
}

function showAdminControls() {
  console.log("  Showing admin controls")
  const adminControls = document.getElementById("adminControls")
  if (adminControls) {
    adminControls.classList.add("show")
  }
}

function hideAdminControls() {
  console.log("  Hiding admin controls")
  const adminControls = document.getElementById("adminControls")
  if (adminControls) {
    adminControls.classList.remove("show")
  }

  // Exit edit mode if active
  if (isEditing) {
    exitEditMode()
  }
}

function initializeEditor() {
  console.log("  Initializing GrapesJS editor")

  try {
    editor = grapesjs.init({
      container: "#main-content",
      height: "100vh",
      width: "auto",
      storageManager: {
        type: "remote",
        stepsBeforeSave: 3,
        options: {
          remote: {
            urlLoad: "/api/load-content",
            urlStore: "/api/save-content",
            headers: {
              "Content-Type": "application/json",
            },
            onLoad: (result) => {
              console.log("  Content loaded:", result)
              return result.data || ""
            },
            onStore: (data) => {
              console.log("  Saving content:", data)
              return { status: "success" }
            },
          },
        },
      },
      plugins: ["gjs-preset-webpage"],
      pluginsOpts: {
        "gjs-preset-webpage": {
          modalImportTitle: "Import Template",
          modalImportLabel:
            '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: (editor) => editor.getHtml() + "<style>" + editor.getCss() + "</style>",
        },
      },
      canvas: {
        styles: [],
        scripts: [],
      },
      panels: {
        defaults: [
          {
            id: "basic-actions",
            el: ".panel__basic-actions",
            buttons: [
              {
                id: "visibility",
                active: true,
                className: "btn-toggle-borders",
                label: '<i class="fa fa-clone"></i>',
                command: "sw-visibility",
              },
            ],
          },
        ],
      },
    })

    // Hide editor initially
    const editorEl = editor.getContainer()
    if (editorEl) {
      editorEl.style.display = "none"
    }

    console.log("  GrapesJS editor initialized successfully")
  } catch (error) {
    console.error("  Error initializing GrapesJS:", error)
  }
}

function toggleEdit() {
  console.log("  Toggling edit mode, current state:", isEditing)

  if (!editor) {
    console.error("  Editor not initialized")
    return
  }

  if (isEditing) {
    exitEditMode()
  } else {
    enterEditMode()
  }
}

function enterEditMode() {
  console.log("  Entering edit mode")

  try {
    isEditing = true

    // Get current page content
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      const currentHtml = mainContent.innerHTML
      console.log("  Current HTML length:", currentHtml.length)

      // Set content in editor
      editor.setComponents(currentHtml)

      // Show editor
      const editorEl = editor.getContainer()
      if (editorEl) {
        editorEl.style.display = "block"
        document.body.classList.add("editing-mode")
      }

      // Hide original content
      mainContent.style.display = "none"

      // Update button text
      const editBtn = document.querySelector(".admin-btn")
      if (editBtn) {
        editBtn.textContent = "👁️ Preview"
      }
    }
  } catch (error) {
    console.error("  Error entering edit mode:", error)
  }
}

function exitEditMode() {
  console.log("  Exiting edit mode")

  try {
    isEditing = false

    // Hide editor
    const editorEl = editor.getContainer()
    if (editorEl) {
      editorEl.style.display = "none"
      document.body.classList.remove("editing-mode")
    }

    // Show original content
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.style.display = "block"
    }

    // Update button text
    const editBtn = document.querySelector(".admin-btn")
    if (editBtn) {
      editBtn.textContent = "✏️ Edit Page"
    }
  } catch (error) {
    console.error("  Error exiting edit mode:", error)
  }
}

function saveContent() {
  console.log("  Saving content")

  if (!editor || !isEditing) {
    console.log("  Not in edit mode, nothing to save")
    return
  }

  try {
    // Get edited content
    const html = editor.getHtml()
    const css = editor.getCss()

    console.log("  HTML length:", html.length)
    console.log("  CSS length:", css.length)

    // Update the main content
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.innerHTML = html
    }

    // Add CSS to page
    let styleEl = document.getElementById("gjs-custom-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "gjs-custom-styles"
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = css

    // Exit edit mode
    exitEditMode()

    alert("Content saved successfully!")
  } catch (error) {
    console.error("  Error saving content:", error)
    alert("Error saving content. Please try again.")
  }
}

function logout() {
  console.log("  Logging out")

  if (window.netlifyIdentity) {
    window.netlifyIdentity.logout()
  }
}

function toggleAuth() {
  console.log("  Toggle auth clicked")

  if (!window.netlifyIdentity) {
    console.error("  Netlify Identity not available")
    return
  }

  const user = window.netlifyIdentity.currentUser()

  if (user) {
    // User is logged in, so logout
    logout()
  } else {
    // User is not logged in, so show login modal
    window.netlifyIdentity.open()
  }
}

// Admin access via URL hash
if (window.location.hash === "#admin") {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open()
    }
  })
}
