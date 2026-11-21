/**
 * SpotZa - Smart Parking Web Application Prototype
 * Core Application Logic & State Management
 * 
 * Features:
 * - 3-screen reactive navigation (Find -> Compare -> Details)
 * - Vehicle-specific tariff engine (Car vs. Bike in Indian Rupees ₹)
 * - Multi-criteria sorting & dynamic filtering
 * - Interactive Estimated Parking Cost Calculator
 * - Real-time availability simulation
 * - Side-by-side comparison matrix modal
 * - Simulated demo reservation pass
 */

// Global Application State
const appState = {
  currentScreen: 'find',
  searchParams: {
    destination: 'City Center Commercial Hub',
    vehicleType: 'car',
    maxBudget: 50,
  },
  filterState: {
    activeFilter: 'all', // 'all' | 'budget' | 'cctv' | 'guard'
    sortBy: 'price-asc', // 'price-asc' | 'distance-asc' | 'availability-desc' | 'rating-desc'
  },
  selectedSpotId: 'spot-1',
  calculatorDuration: 3,
};

// ==========================================
// 1. NAVIGATION & SCREEN MANAGEMENT
// ==========================================

function navigateToScreen(screenName) {
  // Screens map
  const screens = {
    find: document.getElementById('screen-find'),
    compare: document.getElementById('screen-compare'),
    details: document.getElementById('screen-details'),
  };

  if (!screens[screenName]) return;

  // Hide all screens
  Object.values(screens).forEach(screen => {
    screen.classList.add('hidden');
  });

  // Show target screen
  screens[screenName].classList.remove('hidden');
  appState.currentScreen = screenName;

  // Update Breadcrumb Navigation Steps
  updateNavSteps(screenName);

  // Trigger screen-specific render logic
  if (screenName === 'compare') {
    renderCompareScreen();
  } else if (screenName === 'details') {
    renderDetailsScreen();
  }

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Refresh Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

function updateNavSteps(current) {
  const step1 = document.getElementById('nav-step-1');
  const step2 = document.getElementById('nav-step-2');
  const step3 = document.getElementById('nav-step-3');

  // Reset styles
  const activeClass = 'bg-[#2D1136] text-white shadow-sm font-semibold';
  const inactiveClass = 'text-[#5C286A] hover:bg-[#EFE6F6] font-medium';

  [step1, step2, step3].forEach(btn => {
    btn.className = `text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${inactiveClass}`;
  });

  if (current === 'find') {
    step1.className = `text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${activeClass}`;
    step3.disabled = true;
    step3.classList.add('opacity-60', 'cursor-not-allowed');
  } else if (current === 'compare') {
    step2.className = `text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${activeClass}`;
    step3.disabled = true;
    step3.classList.add('opacity-60', 'cursor-not-allowed');
  } else if (current === 'details') {
    step3.disabled = false;
    step3.classList.remove('opacity-60', 'cursor-not-allowed');
    step3.className = `text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${activeClass}`;
  }
}

// ==========================================
// 2. SCREEN 1: SEARCH & INPUT LOGIC
// ==========================================

function selectPresetDestination(name) {
  const destInput = document.getElementById('destination-input');
  if (destInput) {
    destInput.value = name;
    appState.searchParams.destination = name;
  }
}

function setVehicleType(type) {
  appState.searchParams.vehicleType = type;

  const btnCar = document.getElementById('vehicle-btn-car');
  const btnBike = document.getElementById('vehicle-btn-bike');
  const budgetSlider = document.getElementById('budget-slider');
  const budgetMinLabel = document.getElementById('budget-min-label');
  const budgetMaxLabel = document.getElementById('budget-max-label');

  if (type === 'car') {
    btnCar.className = 'py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all bg-[#2D1136] text-white shadow-sm';
    btnBike.className = 'py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all text-[#5C286A] hover:bg-white';
    
    // Budget range for car
    budgetSlider.min = 20;
    budgetSlider.max = 100;
    budgetSlider.step = 5;
    if (appState.searchParams.maxBudget < 20 || appState.searchParams.maxBudget > 100) {
      appState.searchParams.maxBudget = 50;
    }
    budgetSlider.value = appState.searchParams.maxBudget;
    budgetMinLabel.textContent = 'Min: ₹20';
    budgetMaxLabel.textContent = 'Max: ₹100';
  } else {
    btnBike.className = 'py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all bg-[#2D1136] text-white shadow-sm';
    btnCar.className = 'py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all text-[#5C286A] hover:bg-white';
    
    // Budget range for bike
    budgetSlider.min = 10;
    budgetSlider.max = 50;
    budgetSlider.step = 5;
    if (appState.searchParams.maxBudget < 10 || appState.searchParams.maxBudget > 50) {
      appState.searchParams.maxBudget = 25;
    }
    budgetSlider.value = appState.searchParams.maxBudget;
    budgetMinLabel.textContent = 'Min: ₹10';
    budgetMaxLabel.textContent = 'Max: ₹50';
  }

  handleBudgetSliderChange(budgetSlider.value);
}

function handleBudgetSliderChange(value) {
  const numericVal = parseInt(value, 10);
  appState.searchParams.maxBudget = numericVal;
  const display = document.getElementById('budget-value-display');
  if (display) {
    display.textContent = `₹${numericVal}/hr`;
  }
}

function setBudgetExplicit(val) {
  const slider = document.getElementById('budget-slider');
  if (slider) {
    slider.value = val;
    handleBudgetSliderChange(val);
  }
}

function handleFindParkingSubmit(event) {
  event.preventDefault();
  const destInput = document.getElementById('destination-input');
  if (destInput && destInput.value.trim() !== '') {
    appState.searchParams.destination = destInput.value.trim();
  }
  navigateToScreen('compare');
}

// ==========================================
// 3. SCREEN 2: COMPARE PARKING LOGIC
// ==========================================

function renderCompareScreen() {
  const { destination, vehicleType, maxBudget } = appState.searchParams;
  const { activeFilter, sortBy } = appState.filterState;

  // Update Summary Info
  document.getElementById('summary-destination-tag').textContent = destination;
  document.getElementById('summary-vehicle-text').textContent = vehicleType === 'car' ? 'Car (4-Wheeler)' : 'Bike (Two-Wheeler)';
  document.getElementById('summary-budget-text').textContent = `₹${maxBudget}/hr`;

  // Filter spots
  let filteredSpots = SAMPLE_PARKING_DATA.filter(spot => {
    const hourlyPrice = vehicleType === 'car' ? spot.pricing.carHourly : spot.pricing.bikeHourly;

    if (activeFilter === 'budget') {
      return hourlyPrice <= maxBudget;
    }
    if (activeFilter === 'cctv') {
      return spot.security.cctv;
    }
    if (activeFilter === 'guard') {
      return spot.security.securityGuard;
    }
    return true; // 'all'
  });

  // Sort spots
  filteredSpots.sort((a, b) => {
    const priceA = vehicleType === 'car' ? a.pricing.carHourly : a.pricing.bikeHourly;
    const priceB = vehicleType === 'car' ? b.pricing.carHourly : b.pricing.bikeHourly;
    const availA = vehicleType === 'car' ? a.availableSpots.car : a.availableSpots.bike;
    const availB = vehicleType === 'car' ? b.availableSpots.car : b.availableSpots.bike;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'distance-asc') return a.distanceKm - b.distanceKm;
    if (sortBy === 'availability-desc') return availB - availA;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  // Update Count
  document.getElementById('summary-count-text').textContent = `${filteredSpots.length} Parking Locations`;

  // Render Grid
  const grid = document.getElementById('parking-cards-grid');
  const emptyState = document.getElementById('empty-state-card');

  if (filteredSpots.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  grid.innerHTML = filteredSpots.map(spot => {
    const hourlyPrice = vehicleType === 'car' ? spot.pricing.carHourly : spot.pricing.bikeHourly;
    const availableCount = vehicleType === 'car' ? spot.availableSpots.car : spot.availableSpots.bike;
    const capacity = spot.totalCapacity;
    const availabilityPercent = Math.round((availableCount / capacity) * 100);

    const isWithinBudget = hourlyPrice <= maxBudget;
    const budgetDifference = hourlyPrice - maxBudget;

    // Status colors
    let availColorClass = 'bg-[#DCFCE7] text-[#15803D]'; // green
    let barColor = 'bg-[#059669]';
    let availText = 'Ample Spaces';

    if (availabilityPercent < 15) {
      availColorClass = 'bg-[#FEE2E2] text-[#B91C1C]'; // red
      barColor = 'bg-[#DC2626]';
      availText = 'Almost Full';
    } else if (availabilityPercent < 35) {
      availColorClass = 'bg-[#FEF3C7] text-[#B45309]'; // amber
      barColor = 'bg-[#D97706]';
      availText = 'Filling Fast';
    }

    return `
      <div class="spotza-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#8A2E77]/50 relative">
        
        <!-- Header: Featured Tag & Category -->
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#F5EFF9] text-[#5C286A] border border-[#E4D5EC]">
              ${spot.category}
            </span>
            ${spot.featuredTag ? `
              <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#FCE7F3] text-[#8A2E77] border border-[#FBCFE8] flex items-center gap-1">
                <i data-lucide="award" class="w-3 h-3"></i>
                ${spot.featuredTag}
              </span>
            ` : ''}
          </div>

          <!-- Name & Distance -->
          <div>
            <h3 class="text-lg sm:text-xl font-extrabold text-[#2D1136] leading-tight">
              ${spot.name}
            </h3>
            <p class="text-xs text-[#5C286A] mt-1 flex items-center gap-1.5">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#8A2E77] flex-shrink-0"></i>
              <span>${spot.address}</span>
            </p>
          </div>
        </div>

        <!-- Metric Badges Row: Distance & Price -->
        <div class="grid grid-cols-2 gap-2.5 bg-[#F5EFF9]/70 p-3 rounded-2xl border border-[#E4D5EC]">
          <!-- Walking Distance -->
          <div>
            <span class="text-[11px] text-[#5C286A] block">Proximity</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-sm font-bold text-[#2D1136]">${spot.distanceKm} km</span>
              <span class="text-[11px] font-semibold text-[#8A2E77]">(${spot.walkTimeMinutes}m walk)</span>
            </div>
          </div>

          <!-- Hourly Price -->
          <div>
            <span class="text-[11px] text-[#5C286A] block">Hourly Rate (${vehicleType === 'car' ? 'Car' : 'Bike'})</span>
            <div class="flex items-baseline gap-1 mt-0.5">
              <span class="text-lg font-black text-[#2D1136]">₹${hourlyPrice}</span>
              <span class="text-xs text-[#5C286A]">/hr</span>
            </div>
          </div>
        </div>

        <!-- Budget Match Pill -->
        <div class="text-xs">
          ${isWithinBudget ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] font-bold text-[11px]">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>Within Your Budget (₹${maxBudget}/hr)</span>
            </span>
          ` : `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#B45309] font-bold text-[11px]">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
              <span>₹${budgetDifference}/hr above your target</span>
            </span>
          `}
        </div>

        <!-- Availability Meter -->
        <div class="space-y-1.5 pt-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-[#2D1136] flex items-center gap-1">
              <i data-lucide="parking-circle" class="w-3.5 h-3.5 text-[#8A2E77]"></i>
              <span>Available Spaces:</span>
            </span>
            <span class="font-bold ${availColorClass} px-2 py-0.5 rounded text-[11px]">
              ${availableCount} / ${capacity} (${availText})
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-[#E5D5EE] h-2 rounded-full overflow-hidden">
            <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${availabilityPercent}%;"></div>
          </div>
        </div>

        <!-- Security & Guard Tags -->
        <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E4D5EC]">
          <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5C286A] bg-white px-2.5 py-1 rounded-lg border border-[#E4D5EC]">
            <i data-lucide="video" class="w-3 h-3 text-[#8A2E77]"></i>
            <span>${spot.security.cctv ? 'CCTV Monitored' : 'No CCTV'}</span>
          </span>

          <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5C286A] bg-white px-2.5 py-1 rounded-lg border border-[#E4D5EC]">
            <i data-lucide="shield" class="w-3 h-3 text-[#2D1136]"></i>
            <span>${spot.security.securityGuard ? '24/7 Security Guard' : 'Day Attendant'}</span>
          </span>

          <span class="inline-flex items-center gap-1 text-[11px] font-bold text-[#8A2E77] bg-[#FCE7F3] px-2 py-1 rounded-lg ml-auto">
            <i data-lucide="star" class="w-3 h-3 fill-[#8A2E77]"></i>
            <span>${spot.rating}</span>
          </span>
        </div>

        <!-- Card Action CTA -->
        <div class="pt-2">
          <button 
            type="button" 
            onclick="selectSpotById('${spot.id}')"
            class="w-full py-3 px-4 rounded-xl btn-plum font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <span>View Details & Cost Calculator</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function setFilter(filterType) {
  appState.filterState.activeFilter = filterType;

  // Update button active states
  const filters = ['all', 'budget', 'cctv', 'guard'];
  filters.forEach(type => {
    const btn = document.getElementById(`filter-chip-${type}`);
    if (btn) {
      if (type === filterType) {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#2D1136] text-white flex-shrink-0';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-xs font-medium text-[#5C286A] bg-[#F5EFF9] hover:bg-[#EFE6F6] border border-[#E4D5EC] transition-all flex-shrink-0 flex items-center gap-1';
      }
    }
  });

  renderCompareScreen();
}

function handleSortChange(sortVal) {
  appState.filterState.sortBy = sortVal;
  renderCompareScreen();
}

function resetFiltersAndShowAll() {
  setFilter('all');
}

// ==========================================
// 4. SCREEN 3: DETAILS & CALCULATOR LOGIC
// ==========================================

function selectSpotById(id) {
  appState.selectedSpotId = id;
  navigateToScreen('details');
}

function renderDetailsScreen() {
  const spot = SAMPLE_PARKING_DATA.find(s => s.id === appState.selectedSpotId) || SAMPLE_PARKING_DATA[0];
  const { vehicleType, maxBudget } = appState.searchParams;

  const hourlyPrice = vehicleType === 'car' ? spot.pricing.carHourly : spot.pricing.bikeHourly;
  const availableCount = vehicleType === 'car' ? spot.availableSpots.car : spot.availableSpots.bike;

  // Header & Profile
  document.getElementById('detail-category-badge').textContent = spot.category;
  document.getElementById('detail-featured-badge').textContent = spot.featuredTag || 'Verified Facility';
  document.getElementById('detail-name').textContent = spot.name;
  document.getElementById('detail-address').innerHTML = `
    <i data-lucide="map-pin" class="w-4 h-4 text-[#8A2E77] flex-shrink-0"></i>
    <span>${spot.address} • ${spot.landmark}</span>
  `;

  document.getElementById('detail-vehicle-label').textContent = vehicleType === 'car' ? 'Car' : 'Bike';
  document.getElementById('detail-hourly-price').innerHTML = `₹${hourlyPrice}<span class="text-sm font-semibold text-[#5C286A]">/hr</span>`;
  document.getElementById('detail-rating').textContent = spot.rating;

  // 4-Box Key Metrics
  document.getElementById('detail-distance').textContent = `${spot.distanceKm} km`;
  document.getElementById('detail-walk-time').textContent = `(${spot.walkTimeMinutes} min walk)`;
  document.getElementById('detail-available-spots').textContent = `${availableCount} Spaces`;
  document.getElementById('detail-total-capacity').textContent = `${spot.totalCapacity} Spaces`;
  document.getElementById('detail-security-score').textContent = `${spot.security.safetyRating} / 5.0`;

  // Security Box Details
  document.getElementById('detail-cctv-info').textContent = spot.security.cctvDetails;
  document.getElementById('detail-guard-info').textContent = spot.security.guardSchedule;

  // Amenities Grid
  const amenitiesContainer = document.getElementById('detail-amenities-container');
  if (amenitiesContainer) {
    amenitiesContainer.innerHTML = spot.amenities.map(item => `
      <div class="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5EFF9] border border-[#E4D5EC]">
        <div class="w-7 h-7 rounded-lg bg-white text-[#8A2E77] flex items-center justify-center flex-shrink-0 shadow-xs">
          <i data-lucide="${item.icon || 'check'}" class="w-4 h-4"></i>
        </div>
        <div>
          <h5 class="text-xs font-bold text-[#2D1136]">${item.name}</h5>
          <p class="text-[11px] text-[#5C286A] leading-tight mt-0.5">${item.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Update Estimated Cost Calculator
  updateCostCalculator(spot);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function handleDurationSliderChange(hours) {
  appState.calculatorDuration = parseInt(hours, 10);
  const spot = SAMPLE_PARKING_DATA.find(s => s.id === appState.selectedSpotId) || SAMPLE_PARKING_DATA[0];
  updateCostCalculator(spot);
}

function setDurationExplicit(hours) {
  const slider = document.getElementById('duration-slider');
  if (slider) {
    slider.value = hours;
    handleDurationSliderChange(hours);
  }
}

function updateCostCalculator(spot) {
  const { vehicleType, maxBudget } = appState.searchParams;
  const duration = appState.calculatorDuration;
  const hourlyRate = vehicleType === 'car' ? spot.pricing.carHourly : spot.pricing.bikeHourly;

  const subtotal = hourlyRate * duration;
  const budgetAllocated = maxBudget * duration;
  const isUnderBudget = subtotal <= budgetAllocated;

  // Update labels
  document.getElementById('calculator-duration-label').textContent = `${duration} Hour${duration > 1 ? 's' : ''}`;
  document.getElementById('calc-rate-label').textContent = `₹${hourlyRate}/hr`;
  document.getElementById('calc-hours-label').textContent = `${duration} hr${duration > 1 ? 's' : ''}`;
  document.getElementById('calc-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('calc-grand-total').textContent = `₹${subtotal}`;

  // Budget pill comparison
  const budgetPill = document.getElementById('calc-budget-comparison-pill');
  if (isUnderBudget) {
    const diff = budgetAllocated - subtotal;
    budgetPill.className = 'text-[11px] font-bold text-[#059669]';
    budgetPill.textContent = diff === 0 
      ? '✓ Exact match to your budget target' 
      : `✓ Saves ₹${diff} compared to your ₹${budgetAllocated} budget limit`;
  } else {
    const diff = subtotal - budgetAllocated;
    budgetPill.className = 'text-[11px] font-bold text-[#B45309]';
    budgetPill.textContent = `⚠ ₹${diff} higher than your ₹${budgetAllocated} target limit`;
  }
}

// ==========================================
// 5. SIMULATED DEMO INTERACTIONS & MODALS
// ==========================================

function simulateLiveAvailabilityCheck() {
  const btn = document.getElementById('btn-check-availability');
  const icon = document.getElementById('icon-refresh-check');
  const text = document.getElementById('text-check-availability');

  // Spinning indicator
  icon.classList.add('animate-spin');
  text.textContent = 'Checking sensors...';
  btn.disabled = true;

  setTimeout(() => {
    icon.classList.remove('animate-spin');
    text.textContent = 'Availability Verified';
    btn.disabled = false;

    // Show simulated toast notification
    const spot = SAMPLE_PARKING_DATA.find(s => s.id === appState.selectedSpotId) || SAMPLE_PARKING_DATA[0];
    const availableCount = appState.searchParams.vehicleType === 'car' ? spot.availableSpots.car : spot.availableSpots.bike;
    showToastNotification(`Live check verified: ${availableCount} bays available right now!`);

    setTimeout(() => {
      text.textContent = 'Check Availability';
    }, 2500);
  }, 750);
}

function showToastNotification(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (toast && msgEl) {
    msgEl.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 3500);
  }
}

function handleSelectParkingClick() {
  const spot = SAMPLE_PARKING_DATA.find(s => s.id === appState.selectedSpotId) || SAMPLE_PARKING_DATA[0];
  const { vehicleType } = appState.searchParams;
  const duration = appState.calculatorDuration;
  const hourlyRate = vehicleType === 'car' ? spot.pricing.carHourly : spot.pricing.bikeHourly;
  const total = hourlyRate * duration;

  // Fill Modal Information
  document.getElementById('modal-pass-facility').textContent = spot.name;
  document.getElementById('modal-pass-vehicle').textContent = vehicleType === 'car' ? 'Car (4-Wheeler)' : 'Bike (Two-Wheeler)';
  document.getElementById('modal-pass-bay').textContent = vehicleType === 'car' ? 'Level 2 • Bay C-18' : 'Ground Level • Bay M-06';
  document.getElementById('modal-pass-duration').textContent = `${duration} Hour${duration > 1 ? 's' : ''}`;
  document.getElementById('modal-pass-price').textContent = `₹${total}`;

  // Open modal
  const modal = document.getElementById('modal-pass');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeReservationModal() {
  const modal = document.getElementById('modal-pass');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function openComparisonMatrix() {
  const modal = document.getElementById('modal-matrix');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeComparisonMatrix() {
  const modal = document.getElementById('modal-matrix');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function resetSearchToDefaults() {
  appState.searchParams.destination = 'City Center Commercial Hub';
  setVehicleType('car');
  appState.searchParams.maxBudget = 50;
  appState.filterState.activeFilter = 'all';
  appState.filterState.sortBy = 'price-asc';
  appState.calculatorDuration = 3;

  const destInput = document.getElementById('destination-input');
  if (destInput) destInput.value = 'City Center Commercial Hub';

  setFilter('all');
  const sortSelect = document.getElementById('sort-dropdown');
  if (sortSelect) sortSelect.value = 'price-asc';

  navigateToScreen('find');
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize slider display
  handleBudgetSliderChange(50);
});
