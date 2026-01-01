/**
 * Rating System with GraphQL submission for customer orders
 * Works with Thymeleaf-rendered pages served by Spring Boot
 */

class RatingSystem {
  constructor() {
    this.ratings = this.loadRatings();
    this.customerId = this.resolveCustomerId();
    this.initializeRatings();
  }

  loadRatings() {
    const stored = localStorage.getItem('orderRatings');
    return stored ? JSON.parse(stored) : {};
  }

  saveRatings() {
    localStorage.setItem('orderRatings', JSON.stringify(this.ratings));
  }

  resolveCustomerId() {
    const grid = document.getElementById('orders-grid');
    const id = grid?.dataset.customerId;
    return id ? Number(id) : null;
  }

  initializeRatings() {
    const starContainers = document.querySelectorAll('.stars');

    starContainers.forEach(container => {
      const orderId = container.dataset.orderId;
      const stars = container.querySelectorAll('i');

      if (this.ratings[orderId]) {
        this.displayRating(orderId, this.ratings[orderId]);
      }

      stars.forEach((star, index) => {
        star.addEventListener('click', (e) => {
          e.preventDefault();
          this.setRating(orderId, index + 1);
        });

        star.addEventListener('mouseover', () => {
          stars.forEach((s, i) => {
            if (i < index + 1) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });
        });
      });

      container.addEventListener('mouseleave', () => {
        if (this.ratings[orderId]) {
          this.displayRating(orderId, this.ratings[orderId]);
        } else {
          stars.forEach(s => s.classList.remove('active'));
        }
      });
    });

    const submitButtons = document.querySelectorAll('.rating-submit-btn');
    submitButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitRating(btn);
      });
    });
  }

  setRating(orderId, value) {
    this.ratings[orderId] = value;
    this.displayRating(orderId, value);
  }

  displayRating(orderId, value) {
    const container = document.querySelector(`.stars[data-order-id="${orderId}"]`);
    if (!container) return;
    const stars = container.querySelectorAll('i');
    const displayElement = document.getElementById(`rating-display-${orderId}`);

    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });

    if (displayElement) {
      displayElement.style.display = 'block';
      displayElement.querySelector('.current-rating').textContent = value;
    }
  }

  async submitRating(button) {
    const orderId = button.dataset.orderId;
    const rating = this.ratings[orderId];

    if (!rating) {
      alert('Please select a rating before submitting.');
      return;
    }

    if (!this.customerId) {
      alert('Missing customer information. Please reload the page.');
      return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Submitting...';

    const mutation = `mutation SubmitRating($input: RatingInput!) {
      submitRating(input: $input) {
        id
        ratingScore
        review
      }
    }`;

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              orderId: parseInt(orderId),
              customerId: parseInt(this.customerId),
              ratingScore: rating,
              review: null
            }
          }
        })
      });

      const result = await response.json();
      if (result.errors) {
        const errorMsg = result.errors.map(e => e.message).join(', ');
        if (errorMsg.includes('already rated')) {
          throw new Error('A rating has already been submitted');
        }
        throw new Error(errorMsg);
      }

      this.saveRatings();

      const thankYouElement = document.getElementById(`thank-you-${orderId}`);
      if (thankYouElement) {
        thankYouElement.style.display = 'block';
      }

      button.style.display = 'none';
      console.log(`Rating submitted for order ${orderId}: ${rating}/5 stars`, result.data);
    } catch (err) {
      console.error('Failed to submit rating', err);
      button.disabled = false;
      button.textContent = originalText;
      alert(`Failed to submit rating: ${err.message || 'Please try again.'}`);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new RatingSystem();
});
