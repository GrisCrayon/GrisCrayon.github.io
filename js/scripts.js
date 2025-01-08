window.addEventListener("DOMContentLoaded", async () => {
  // Navbar shrink function
  const navbarShrink = () => {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) return;

    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map((responsiveNavItem) => {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Initiate Pure Counter
  new PureCounter();

  // Initiate AOS
  AOS.init();

  // PORTFOLIO
  // Load and generate portfolio dynamically from JSON
  const portfolioContainer = document.getElementById("portfolio-items");
  const portfolioModalsContainer = document.getElementById("portfolio-modals");
  const filterContainer = document.querySelector(".portfolio-filters");

  try {
    const response = await fetch("../json/portfolio.json");
    const portfolioItems = await response.json();

    const filters = new Set();

    portfolioItems.forEach((item) => {
      // Dynamically generate "filter" and "type" from "category"
      const categorySlug = item.category.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with "-"
      const filter = `filter-${categorySlug}`;
      const type = item.category;

      // Add portfolio items to the grid
      const portfolioItemHTML = `
      <div class="col-lg-4 col-sm-6 mb-4 portfolio-item isotope-item ${filter}">
          <div class="portfolio-item">
              <a class="portfolio-link" data-bs-toggle="modal" href="#${item.id}">
                  <div class="portfolio-hover">
                      <div class="portfolio-hover-content">
                          <i class="fas fa-plus fa-3x"></i>
                      </div>
                  </div>
                  <img class="img-fluid" src="${item.image}" alt="${item.title}" />
              </a>
              <div class="portfolio-caption">
                  <div class="portfolio-caption-heading">${item.title}</div>
                  <div class="portfolio-caption-subheading text-muted">${type}</div>
              </div>
          </div>
      </div>`;
      portfolioContainer.insertAdjacentHTML("beforeend", portfolioItemHTML);

      // Add modals for each portfolio item
      const modalHTML = `
      <div class="portfolio-modal modal fade" id="${item.id}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="close-modal" data-bs-dismiss="modal">
                      <img src="assets/img/close-icon.svg" alt="Close modal" />
                  </div>
                  <div class="container">
                      <div class="row justify-content-center">
                          <div class="col-lg-8">
                              <div class="modal-body">
                                  <h2 class="text-uppercase">${item.title}</h2>
                                  <p class="item-intro text-muted">${type}</p>
                                  <img class="img-fluid d-block mx-auto" src="${item.image}" alt="${item.title}" />
                                  <p>${item.description}</p>
                                  <ul class="list-inline">
                                      <li><strong>Client:</strong> ${item.client}</li>
                                      <li><strong>Category:</strong> ${type}</li>
                                  </ul>
                                  <button class="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
                                      <i class="fas fa-xmark me-1"></i> Close Project
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
      portfolioModalsContainer.insertAdjacentHTML("beforeend", modalHTML);

      // Collect filters for the portfolio items
      filters.add(filter);
    });

    // Add filter buttons to the HTML
    filters.forEach((filter) => {
      const filterName = filter.replace("filter-", "").replace("-", " ");
      filterContainer.insertAdjacentHTML(
        "beforeend",
        `<li data-filter=".${filter}">${
          filterName.charAt(0).toUpperCase() + filterName.slice(1)
        }</li>`
      );
    });

    // Initialize Isotope for portfolio filtering
    const isotope = new Isotope(portfolioContainer, {
      itemSelector: ".isotope-item",
      layoutMode: "fitRows",
    });

    // Apply the "All" filter immediately on page load
    isotope.arrange({ filter: "*" });

    // Highlight the "All" button as active
    const allFilterButton = document.querySelector('[data-filter="*"]');
    if (allFilterButton) {
      allFilterButton.classList.add("filter-active");
    } else {
      console.warn("All filter button not found");
    }

    // Add click listeners to filter buttons
    const filterButtons = document.querySelectorAll(".portfolio-filters li");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active filter class
        document
          .querySelector(".portfolio-filters .filter-active")
          ?.classList.remove("filter-active");
        button.classList.add("filter-active");

        // Apply filter to Isotope
        const filterValue = button.getAttribute("data-filter");
        isotope.arrange({ filter: filterValue });
      });
    });

    // arrange image once its loaded
    imagesLoaded(portfolioContainer, () => {
      isotope.arrange({ filter: "*" });
    });
  } catch (error) {
    console.error("Error loading portfolio items:", error);
  }

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

  /**
   * Testimonials Carousel Logic
   */
  const carouselInner = document.querySelector(".carousel-inner");
  const paginationContainer = document.querySelector(".pagination");

  // Load testimonials data from JSON
  try {
    const response = await fetch("../json/testimonials.json");
    const testimonials = await response.json();

    let itemsPerPage = window.innerWidth <= 770 ? 1 : 3; // Display 1 or 3 items depending on screen size
    let totalPages = Math.ceil(testimonials.length / itemsPerPage);
    let currentPage = 0;

    // Generate testimonials
    testimonials.forEach((testimonial, index) => {
      const activeClass = index < itemsPerPage ? "active" : "";
      const stars = Array(testimonial.stars)
        .fill('<i class="bi bi-star-fill"></i>')
        .join("");

      const testimonialHTML = `
      <div class="carousel-item ${activeClass}">
        <div class="testimonial-item">
          <img src="${testimonial.image}" class="testimonial-img" alt="${testimonial.name}">
          <h3>${testimonial.name}</h3>
          <h4>${testimonial.role}</h4>
          <div class="stars">${stars}</div>
          <p>
            <i class="bi bi-quote quote-icon-left"></i>
            ${testimonial.comment}
            <i class="bi bi-quote quote-icon-right"></i>
          </p>
        </div>
      </div>
    `;
      carouselInner.insertAdjacentHTML("beforeend", testimonialHTML);
    });

    // Create pagination dots
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      paginationContainer.appendChild(dot);
    }

    const dots = Array.from(paginationContainer.querySelectorAll(".dot"));

    // Function to update the carousel
    const updateCarousel = () => {
      const items = Array.from(
        carouselInner.querySelectorAll(".carousel-item")
      );

      items.forEach((item, index) => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;

        if (index >= start && index < end) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
      });
    };

    // Function to dynamically adjust the carousel on resize
    const resizeHandler = () => {
      itemsPerPage = window.innerWidth <= 770 ? 1 : 3;
      totalPages = Math.ceil(testimonials.length / itemsPerPage);
      currentPage = 0;
      updateCarousel();
    };

    // Add event listeners for navigation buttons
    document
      .querySelector(".carousel-control-prev")
      .addEventListener("click", () => {
        currentPage = currentPage > 0 ? currentPage - 1 : totalPages - 1;
        updateCarousel();
      });

    document
      .querySelector(".carousel-control-next")
      .addEventListener("click", () => {
        currentPage = currentPage < totalPages - 1 ? currentPage + 1 : 0;
        updateCarousel();
      });

    // Add event listeners for pagination dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentPage = index;
        updateCarousel();
      });
    });

    // Reinitialize carousel on window resize
    window.addEventListener("resize", resizeHandler);

    // Initialize the carousel
    updateCarousel();
  } catch (error) {
    console.error("Failed to load testimonials:", error);
  }

  /**
   * Email
   */
  emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS Public Key

  // Handle form submission
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Gather form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        message: document.getElementById("message").value,
      };

      // Send the email using EmailJS
      emailjs
        .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData) // Replace with your Service ID and Template ID
        .then(
          function (response) {
            // Show success message
            document
              .getElementById("submitSuccessMessage")
              .classList.remove("d-none");
            document
              .getElementById("submitErrorMessage")
              .classList.add("d-none");
            console.log("SUCCESS!", response.status, response.text);
          },
          function (error) {
            // Show error message
            document
              .getElementById("submitErrorMessage")
              .classList.remove("d-none");
            document
              .getElementById("submitSuccessMessage")
              .classList.add("d-none");
            console.log("FAILED...", error);
          }
        );

      // Clear the form after submission
      this.reset();
    });
});
