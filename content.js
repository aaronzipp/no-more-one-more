function countdownText(countdown) {
  return `Continue in ${countdown} seconds`;
}

function addFrictionOverlay(player, onContinue) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.9)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999",
    flexDirection: "column",
  });

  const msg = document.createElement("div");
  msg.innerText = "Do you really want to watch another episode?";
  msg.style.fontSize = "24px";
  msg.style.marginBottom = "20px";

  const countdownDisplay = document.createElement("div");
  countdownDisplay.style.fontSize = "18px";
  countdownDisplay.style.marginBottom = "10px";

  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Yes, continue";
  continueBtn.style.fontSize = "20px";
  continueBtn.style.padding = "10px 20px";
  continueBtn.style.cursor = "pointer";
  continueBtn.disabled = true;
  continueBtn.style.opacity = "0.5";

  continueBtn.onclick = () => {
    overlay.remove();
    if (onContinue) onContinue();
  };

  overlay.appendChild(msg);
  overlay.appendChild(countdownDisplay);
  overlay.appendChild(continueBtn);
  player.appendChild(overlay);

  // Get countdown value from storage, default to 10 seconds
  chrome.storage.sync.get(['countdownSeconds'], function(result) {
    let countdown = result.countdownSeconds || 10;
    countdownDisplay.innerText = countdownText(countdown);

    const countdownInterval = setInterval(() => {
      countdown--;
      countdownDisplay.innerText = countdownText(countdown);

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.innerText = "";
        continueBtn.disabled = false;
        continueBtn.style.opacity = "1";
        continueBtn.innerText = "Yes, continue";
      }
    }, 1000);
  });
}

const observer = new MutationObserver(() => {
  const nextButton = document.querySelector(
    "button[data-uia='next-episode-seamless-button']",
  );
  if (!nextButton || nextButton.dataset.friction) return;

  const link = nextButton.querySelector("a");
  const nextUrl = link ? link.href : null;

  const player = document.querySelector(".watch-video") || document.body;
  addFrictionOverlay(player, () => {
    if (document.body.contains(nextButton)) {
      nextButton.click();
    } else if (nextUrl) {
      window.location.href = nextUrl;
    }
  });

  nextButton.dataset.friction = "true";
});

observer.observe(document.body, { childList: true, subtree: true });
