function onReady(completed) {
    if (document.readyState === "complete") {
        setTimeout(completed);
    } else {
        document.addEventListener("DOMContentLoaded", completed, false);
    }
}

function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else {
        if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else {
            if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else {
                if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
        }
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
}

function closest(element, selector) {
    var matchesSelector;

    matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector;

    while (element) {
        if (element !== document && matchesSelector.bind(element)(selector)) {
            return element;
        } else {
            element = element.parentNode;
        }
    }

    return false;
}

function showDescription(element) {
    var parent, description, left, top, width, height;

    parent = document.getElementById("points-of-interest");

    description = document.getElementById("current-point-of-interest-description");

    if (description) {
        description.parentNode.removeChild(description);
    }

    element.classList.add("active");

    description = document.createElement("div");

    description.setAttribute("id", "current-point-of-interest-description");

    description.innerHTML = document.getElementById(element.getAttribute("data-description")).innerHTML;

    width = parseInt(element.getAttribute("data-description-width"));

    if (!width || width < 300) {
        width = 300;
    }

    description.style.width = width.toString() + "px";

    left = element.offsetLeft + ((element.offsetWidth - width) / 2);

    if (left > parent.offsetWidth - width - 10) {
        left = parent.offsetWidth - width - 10;
    } else {
        if (left < 10) {
            left = 10;
        }
    }

    height = parseInt(element.getAttribute("data-description-height"));

    if (!height || height < 20) {
        height = 20;
    }

    description.style.height = height.toString() + "px";

    top = element.offsetTop - (height + 10);

    if (top < 10) {
        top = element.offsetTop + element.offsetHeight + 10;
    }

    description.style.left = left.toString() + "px";

    description.style.top = top.toString() + "px";

    parent.appendChild(description);

    return description;
}

onReady(function() {
    var fullscreen, pointsOfInterest, hotSpots, phase, phaseSelectors;

    fullscreen = false;

    document.addEventListener("keyup", function(event) {
        if (event.keyCode === 70) {
            if (!fullscreen) {
                launchFullscreen(document.documentElement);

                fullscreen = true;
            } else {
                exitFullscreen();

                fullscreen = false;
            }
        }
    });

    pointsOfInterest = document.querySelectorAll("#points-of-interest .point-of-interest");

    if (pointsOfInterest && pointsOfInterest.length > 0) {
        for (var i = 0; i < pointsOfInterest.length; i++) {
            pointsOfInterest[i].addEventListener("click", function(event) {
                event.preventDefault();

                showDescription(this);
            });
        }
    }

    hotSpots = document.querySelectorAll("#points-of-interest .hotspot");

    if (hotSpots && hotSpots.length > 0) {
        phase = 0;

        window.setInterval(function() {
            if (phase > 2) {
                phase = 0;
            }

            for (var i = 0; i < hotSpots.length; i++) {
                if (hotSpots[i].classList.contains("active")) {
                    hotSpots[i].style.backgroundPosition = "-" + (phase * 45).toString() + "px -45px";
                } else {
                    hotSpots[i].style.backgroundPosition = "-" + (phase * 45).toString() + "px 0";
                }
            }

            phase++;
        }, 750);

        for (var i = 0; i < hotSpots.length; i++) {
            hotSpots[i].addEventListener("click", function(event) {
                event.preventDefault();

                showDescription(this);
            });
        }
    }

    document.addEventListener("click", function(event) {
        var pointsOfInterest, hotSpots, description;

        pointsOfInterest = document.querySelectorAll("#points-of-interest .point-of-interest");

        if (pointsOfInterest && pointsOfInterest.length > 0) {
            for (var i = 0; i < pointsOfInterest.length; i++) {
                var closestPointOfInterest;

                closestPointOfInterest = closest(event.toElement, ".point-of-interest");

                if (closestPointOfInterest !== pointsOfInterest[i]) {
                    pointsOfInterest[i].classList.remove("active");
                }
            }
        }

        hotSpots = document.querySelectorAll("#points-of-interest .hotspot");

        if (hotSpots && hotSpots.length > 0) {
            for (var i = 0; i < hotSpots.length; i++) {
                var closestHotspot;

                closestHotspot = closest(event.toElement, ".hotspot");

                if (closestPointOfInterest !== hotSpots[i]) {
                    hotSpots[i].classList.remove("active");
                }
            }
        }

        if (!closest(event.toElement, ".point-of-interest") && !closest(event.toElement, ".hotspot")) {
            description = document.getElementById("current-point-of-interest-description");

            if (description) {
                description.parentNode.removeChild(description);
            }
        }
    });

    phaseSelectors = document.querySelectorAll("#points-of-interest .phase-selector");

    if (phaseSelectors && phaseSelectors.length > 0) {
        for (var i = 0; i < phaseSelectors.length; i++) {
            phaseSelectors[i].addEventListener("click", function(event) {
                var parent, phaseSelector, phaseLeft, phaseRight, description, width, height, left, right, top;

                event.preventDefault();

                for (var j = 0; j < phaseSelectors.length; j++) {
                    phaseSelectors[j].classList.remove("active");
                }

                parent = document.getElementById("points-of-interest");

                phaseSelector = this;

                phaseLeft = document.getElementById("phase-left");

                if (phaseLeft) {
                    phaseLeft.parentNode.removeChild(phaseLeft);

                    description = document.getElementById("current-phase-description");

                    if (description) {
                        description.parentNode.removeChild(description);
                    }
                } else {
                    phaseSelector.classList.add("active");

                    description = document.getElementById("current-phase-description");

                    if (description) {
                        description.parentNode.removeChild(description);
                    }

                    description = document.createElement("div");

                    description.setAttribute("id", "current-phase-description");

                    description.innerHTML = document.getElementById(phaseSelector.getAttribute("data-description")).innerHTML;

                    width = parseInt(phaseSelector.getAttribute("data-description-width"));

                    if (!width) {
                        width = 400;
                    } else {
                        if (width < 300) {
                            width = 300;
                        }
                    }

                    description.style.width = width.toString() + "px";

                    if (phaseSelector.getAttribute("data-description-direction") === "left") {
                        left = phaseSelector.offsetLeft - width - 30;
                    } else {
                        if (phaseSelector.getAttribute("data-description-direction") === "bottom") {
                            left = phaseSelector.offsetLeft + 30;
                        } else {
                            left = phaseSelector.offsetLeft + phaseSelector.offsetWidth + 30;
                        }
                    }

                    if (left > parent.offsetWidth - width - 10) {
                        left = parent.offsetWidth - width - 10;
                    } else {
                        if (left < 10) {
                            left = 10;
                        }
                    }

                    height = parseInt(phaseSelector.getAttribute("data-description-height"));

                    if (!height || height < 100) {
                        height = 100;
                    }

                    description.style.height = height.toString() + "px";

                    if (phaseSelector.getAttribute("data-description-direction") === "bottom") {
                        top = phaseSelector.offsetTop + phaseSelector.offsetHeight;
                    } else {
                        top = phaseSelector.offsetTop;
                    }

                    description.style.left = left.toString() + "px";

                    description.style.top = top.toString() + "px";

                    parent.appendChild(description);

                    phaseLeft = document.createElement("div");

                    phaseLeft.setAttribute("id", "phase-left");

                    phaseLeft.style.width = phaseSelector.getAttribute("data-left-width") + "px";

                    phaseLeft.style.height = parent.offsetHeight.toString() + "px";

                    phaseLeft.style.top = "0";

                    phaseLeft.style.left = "0";

                    parent.appendChild(phaseLeft);
                }

                phaseRight = document.getElementById("phase-right");

                if (phaseRight) {
                    phaseRight.parentNode.removeChild(phaseRight);
                } else {
                    phaseRight = document.createElement("div");

                    phaseRight.setAttribute("id", "phase-right");

                    phaseRight.style.width = parent.offsetWidth - parseInt(phaseSelector.getAttribute("data-right-start")).toString() + "px";

                    phaseRight.style.height = parent.offsetHeight.toString() + "px";

                    phaseRight.style.top = "0";

                    phaseRight.style.left = phaseSelector.getAttribute("data-right-start") + "px";

                    parent.appendChild(phaseRight);
                }

                phaseLeft.addEventListener("click", function(event) {
                    event.preventDefault();

                    phaseLeft.parentNode.removeChild(phaseLeft);

                    phaseRight.parentNode.removeChild(phaseRight);

                    for (var j = 0; j < phaseSelectors.length; j++) {
                        phaseSelectors[j].classList.remove("active");
                    }

                    description = document.getElementById("current-phase-description");

                    if (description) {
                        description.parentNode.removeChild(description);
                    }
                });

                phaseRight.addEventListener("click", function(event) {
                    event.preventDefault();

                    phaseLeft.parentNode.removeChild(phaseLeft);

                    phaseRight.parentNode.removeChild(phaseRight);

                    for (var j = 0; j < phaseSelectors.length; j++) {
                        phaseSelectors[j].classList.remove("active");
                    }

                    description = document.getElementById("current-phase-description");

                    if (description) {
                        description.parentNode.removeChild(description);
                    }
                });
            });
        }
    }
});
