// ========================================
// SMOOTHSIGNUP - SIGN-UP FLOW
// ========================================

// Get HTML elements
const form = document.getElementById("signup-form");
const steps = document.querySelectorAll(".form-step");

const stepLabel = document.getElementById("step-label");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");

const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");

const successScreen = document.getElementById("success-screen");
const successMessage = document.getElementById("success-message");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");

const restartButton = document.getElementById("restart-btn");

const nameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const termsCheckbox = document.getElementById("terms");

// Current step
let currentStep = 1;

const totalSteps = 3;

// Text for each step
const stepContent = {
  1: {
    title: "Create your account",
    description: "Let's get to know you a little better.",
  },

  2: {
    title: "Where can we reach you?",
    description: "Enter your email address to continue.",
  },

  3: {
    title: "Secure your account",
    description: "Choose a password to keep your account safe.",
  },
};

// ========================================
// DISPLAY THE CURRENT STEP
// ========================================

function showStep(stepNumber) {
  currentStep = stepNumber;

  // Show the correct form step
  steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });

  // Update progress
  const progress = (currentStep / totalSteps) * 100;

  stepLabel.textContent = `STEP ${currentStep} OF ${totalSteps}`;
  progressPercent.textContent = `${Math.round(progress)}%`;
  progressFill.style.width = `${progress}%`;

  // Update heading and description
  formTitle.textContent = stepContent[currentStep].title;

  formDescription.textContent = stepContent[currentStep].description;

  // Clear old error messages
  clearErrors();

  // Reset password visibility when leaving its step
  if (currentStep !== 3) {
    passwordInput.type = "password";
    togglePassword.textContent = "Show";
    togglePassword.setAttribute("aria-label", "Show password");
  }
}

// ========================================
// ERROR HANDLING
// ========================================

function showError(errorId, message) {
  document.getElementById(errorId).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });
}

// ========================================
// VALIDATE EACH STEP
// ========================================

function validateStep(stepNumber) {
  clearErrors();

  if (stepNumber === 1) {
    const fullName = nameInput.value.trim();

    if (fullName.length < 2) {
      showError("name-error", "Please enter your full name.");

      nameInput.focus();
      return false;
    }

    if (fullName.length > 100) {
      showError("name-error", "Your name is too long.");

      nameInput.focus();
      return false;
    }
  }

  if (stepNumber === 2) {
    const email = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showError("email-error", "Please enter a valid email address.");

      emailInput.focus();
      return false;
    }
  }

  if (stepNumber === 3) {
    const password = passwordInput.value;

    if (password.length < 8) {
      showError(
        "password-error",
        "Your password must contain at least 8 characters.",
      );

      passwordInput.focus();
      return false;
    }

    if (!termsCheckbox.checked) {
      showError("terms-error", "Please agree to the terms before continuing.");

      termsCheckbox.focus();
      return false;
    }
  }

  return true;
}

// ========================================
// CONTINUE BUTTONS
// ========================================

document.querySelectorAll(".next-btn").forEach((button) => {
  if (button.type !== "button") return;

  button.addEventListener("click", () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  });
});

// ========================================
// BACK BUTTONS
// ========================================

document.querySelectorAll(".back-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});

// ========================================
// SHOW OR HIDE PASSWORD
// ========================================

togglePassword.addEventListener("click", () => {
  const passwordIsHidden = passwordInput.type === "password";

  passwordInput.type = passwordIsHidden ? "text" : "password";

  togglePassword.textContent = passwordIsHidden ? "Hide" : "Show";

  togglePassword.setAttribute(
    "aria-label",
    passwordIsHidden ? "Hide password" : "Show password",
  );
});

// ========================================
// SUBMIT THE SIGN-UP FORM
// ========================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateStep(3)) {
    return;
  }

  const fullName = nameInput.value.trim();

  // Hide the form
  form.hidden = true;

  // Hide the introduction
  document.querySelector(".welcome-text").hidden = true;

  // Display the success screen
  successScreen.hidden = false;

  successMessage.textContent = `Congratulations, ${fullName}! Your sign-up demo is complete.`;

  // Update progress to 100%
  stepLabel.textContent = "COMPLETED";
  progressPercent.textContent = "100%";
  progressFill.style.width = "100%";
});

// ========================================
// RESTART THE SIGN-UP FLOW
// ========================================

restartButton.addEventListener("click", () => {
  // Reset the form fields
  form.reset();

  // Show the form again
  form.hidden = false;

  // Show the introduction again
  document.querySelector(".welcome-text").hidden = false;

  // Hide the success screen
  successScreen.hidden = true;

  // Return to the first step
  showStep(1);

  // Reset the progress bar
  progressFill.style.width = `${100 / totalSteps}%`;

  // Return to the top of the form
  nameInput.focus();
});

// ========================================
// INITIALIZE THE FORM
// ========================================

showStep(1);
