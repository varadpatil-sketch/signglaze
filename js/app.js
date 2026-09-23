/**
 * SIGN GLAZE TECHNOLOGY (SGT) - INTERACTIVE ENGINE
 * Total Solution for Indoor & Outdoor Signages
 * Thane, Mumbai, Maharashtra
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DAY / NIGHT AMBIENCE GLOW TOGGLE
  // ==========================================================================
  const ambienceToggle = document.getElementById('ambienceToggle');
  const ambienceLabel = document.getElementById('ambienceLabel');
  const body = document.body;

  if (ambienceToggle) {
    ambienceToggle.addEventListener('click', () => {
      const isNight = body.classList.toggle('night-mode');
      if (ambienceLabel) {
        ambienceLabel.textContent = isNight ? 'Night Glow' : 'Daylight Mode';
      }
      ambienceToggle.setAttribute('title', isNight ? 'Switch to Daylight View' : 'Switch to Illuminated Night Glow');
    });
  }

  // ==========================================================================
  // 2. INTERACTIVE ARCHITECTURAL BUILDING HOTSPOTS
  // ==========================================================================
  const hotspotData = {
    roof: {
      category: 'ARCHITECTURAL ROOF / SKYLINE',
      title: 'Roof Signs & 3D Dimensional Letters',
      desc: 'High-elevation rooftop installations engineered with heavy-gauge MS truss frameworks to withstand high velocity wind loads. Features laser-cut 3D channel letters with IP67 Samsung/Osram LED modules for maximum long-distance visibility across highways and city centers.',
      substrate: 'Fabricated MS Structure + 3mm-4mm ACP Cladding',
      lighting: 'Front-lit Cast Acrylic or Halo Backlit Metal',
      clients: 'Empire Tower, C&H Jefferson, Corporate Headquarters',
      stylePreset: 'brass',
      colorPreset: '#ffb703'
    },
    wall: {
      category: 'FACADE / MAIN WALL SIGNAGE',
      title: 'Wall Signs & Architectural ACP Cladding',
      desc: 'Full-building elevation claddings and large format wall trays made from CNC-grooved Aluminium Composite Panels (ACP). Letters can be flush-mounted, push-through acrylic, or standalone backlit metal channel letters.',
      substrate: 'PVDF Coated ACP Sheets + MS Tubular Grid',
      lighting: 'Internal Push-through LED / Backlit LED Modules',
      clients: 'Flamingo Pharmaceuticals, ERGO, AdvantEDGE',
      stylePreset: 'acp',
      colorPreset: '#00f0ff'
    },
    blade: {
      category: 'PROJECTING STREET LEVEL BRANDING',
      title: 'Double-Sided Projecting Blade Signs',
      desc: 'Perpendicular cantilevered signs designed to catch pedestrian and vehicular traffic from both directions. Fabricated with internal welded steel mounting plates and weather-sealed translucent acrylic faces.',
      substrate: 'Powder-coated MS Bracket + Aluminium Box + Acrylic Face',
      lighting: 'Double-sided Uniform Edge-lit or Backlit LED',
      clients: 'Delhi Belly, Loft, Byron, High Street Retail Outlets',
      stylePreset: 'crystal',
      colorPreset: '#ffb703'
    },
    totem: {
      category: 'CAMPUS & HIGHWAY MONOLITH',
      title: 'Totem Poles, Unipoles & Monument Signage',
      desc: 'Free-standing landmark monolith pylons anchored deep into reinforced concrete foundations. Features modular interchangeable panels for multi-tenant business parks, retail malls, and automobile dealerships.',
      substrate: 'I-Beam MS Structural Skeleton + ACP Fascia Panels',
      lighting: 'Zoned High-Lumen LED Backlighting (IP67)',
      clients: 'Dell, Volvo, Goodyear, Reliable Tech Park, Galeria Mall',
      stylePreset: 'acp',
      colorPreset: '#ffffff'
    },
    glass: {
      category: 'INTERIOR CORPORATE ARCHITECTURE',
      title: 'Frosted & Etched Glass Reception Signs',
      desc: 'Understated, sophisticated corporate branding installed directly on drywall, glass partitions, or luxury wood paneling. Constructed using toughened architectural glass with precision laser-etched logos and machined stainless steel standoffs.',
      substrate: '8mm-12mm Toughened Glass / Clear Cast Acrylic',
      lighting: 'Concealed Top/Bottom LED Edge-lit Aluminium Extrusion',
      clients: 'Stewart, RBS, Spa & Wellness, Corporate Law Firms',
      stylePreset: 'glass',
      colorPreset: '#ffffff'
    },
    banners: {
      category: 'PORTABLE & EXHIBITION DISPLAYS',
      title: 'Roll-Up Banner Stands & High-Res Printing',
      desc: 'Lightweight, rapid-deployment pull-up promotional banner stands for expos, lobbies, conferences, and retail promotions. Printed on non-tear, anti-curl satin synthetic media with high-resolution digital printers.',
      substrate: 'Aluminium Retractable Base + Anti-curl Synthetic Film',
      lighting: 'Optional Clip-on LED Exhibition Spotlight',
      clients: 'Trade Fairs, Banking Counters, Product Launches',
      stylePreset: 'crystal',
      colorPreset: '#ffb703'
    }
  };

  const hotspotPins = document.querySelectorAll('.hotspot-pin');
  const hpCategory = document.getElementById('hpCategory');
  const hpTitle = document.getElementById('hpTitle');
  const hpDescription = document.getElementById('hpDescription');
  const hpSubstrate = document.getElementById('hpSubstrate');
  const hpLighting = document.getElementById('hpLighting');
  const hpClients = document.getElementById('hpClients');
  const hpSimulateBtn = document.getElementById('hpSimulateBtn');

  let currentHotspotKey = 'roof';

  function updateHotspot(key) {
    const data = hotspotData[key];
    if (!data) return;
    currentHotspotKey = key;

    hotspotPins.forEach(pin => {
      if (pin.dataset.hotspot === key) {
        pin.classList.add('active');
      } else {
        pin.classList.remove('active');
      }
    });

    if (hpCategory) hpCategory.textContent = data.category;
    if (hpTitle) hpTitle.textContent = data.title;
    if (hpDescription) hpDescription.textContent = data.desc;
    if (hpSubstrate) hpSubstrate.textContent = data.substrate;
    if (hpLighting) hpLighting.textContent = data.lighting;
    if (hpClients) hpClients.textContent = data.clients;
  }

  hotspotPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const key = pin.dataset.hotspot;
      updateHotspot(key);
    });
  });

  if (hpSimulateBtn) {
    hpSimulateBtn.addEventListener('click', () => {
      const targetData = hotspotData[currentHotspotKey];
      if (targetData && typeof setSimulatorPreset === 'function') {
        setSimulatorPreset(targetData.stylePreset, targetData.colorPreset);
      }
      const simSection = document.getElementById('simulator');
      if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================================================
  // 3. LIVE SIGNAGE SIMULATOR & CUSTOMIZER
  // ==========================================================================
  const simBrandInput = document.getElementById('simBrandInput');
  const simTaglineInput = document.getElementById('simTaglineInput');
  const simBrandText = document.getElementById('simBrandText');
  const simTaglineText = document.getElementById('simTaglineText');
  const simPlate = document.getElementById('simPlate');
  const simStage = document.getElementById('simStage');
  const glowSlider = document.getElementById('glowSlider');
  const intensityVal = document.getElementById('intensityVal');

  const styleButtons = document.querySelectorAll('#stylePicker .option-btn');
  const colorSwatches = document.querySelectorAll('#colorPicker .color-swatch');
  const wallButtons = document.querySelectorAll('#wallPicker .option-btn');
  const fontButtons = document.querySelectorAll('#fontPicker .option-btn');

  const specCurrentStyle = document.getElementById('specCurrentStyle');
  const specCurrentColor = document.getElementById('specCurrentColor');
  const btnOrderCurrentDesign = document.getElementById('btnOrderCurrentDesign');
  const standoffBolts = document.querySelectorAll('.standoff-bolt');

  let currentStyle = 'brass';
  let currentColor = '#ffb703';
  let currentColorName = 'Warm Golden Amber (3000K)';
  let currentWall = 'granite';
  let currentFont = "'Outfit', sans-serif";
  let currentIntensity = 85;

  // Live text input binding
  if (simBrandInput && simBrandText) {
    simBrandInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      simBrandText.textContent = val.length > 0 ? val : 'YOUR BRAND';
    });
  }

  if (simTaglineInput && simTaglineText) {
    simTaglineInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      simTaglineText.textContent = val;
      simTaglineText.style.display = val.length > 0 ? 'block' : 'none';
    });
  }

  // Apply styling properties to the simulated plate
  function renderSimulator() {
    if (!simPlate) return;

    // Reset styles
    simPlate.className = 'simulated-signage-plate';
    simPlate.classList.add(`style-${currentStyle}`);

    // Update CSS variables for glow
    const glowRadius = Math.round((currentIntensity / 100) * 45) + 'px';
    simPlate.style.setProperty('--sim-glow-radius', glowRadius);
    simPlate.style.setProperty('--sim-glow-color', currentColor);

    // Font family
    simBrandText.style.fontFamily = currentFont;

    // Handle Glass standoffs visibility
    standoffBolts.forEach(bolt => {
      bolt.style.display = currentStyle === 'glass' ? 'block' : 'none';
    });

    // Wall texture
    if (simStage) {
      simStage.className = `sim-display-stage wall-${currentWall}`;
    }

    // Update spec labels
    if (specCurrentStyle) {
      const activeBtn = document.querySelector('#stylePicker .option-btn.active');
      specCurrentStyle.textContent = activeBtn ? activeBtn.textContent : currentStyle;
    }
    if (specCurrentColor) {
      specCurrentColor.textContent = currentColorName;
    }
  }

  // Style buttons listener
  styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      styleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = btn.dataset.style;
      renderSimulator();
    });
  });

  // Color Swatches listener
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      currentColor = swatch.dataset.color;
      currentColorName = swatch.dataset.name;
      renderSimulator();
    });
  });

  // Wall Texture buttons listener
  wallButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      wallButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWall = btn.dataset.wall;
      renderSimulator();
    });
  });

  // Font buttons listener
  fontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fontButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFont = btn.dataset.font;
      renderSimulator();
    });
  });

  // Glow Intensity Slider
  if (glowSlider) {
    glowSlider.addEventListener('input', (e) => {
      currentIntensity = parseInt(e.target.value, 10);
      if (intensityVal) intensityVal.textContent = `${currentIntensity}%`;
      renderSimulator();
    });
  }

  // 3D Perspective Tilt Effect on mouse movement
  if (simStage && simPlate) {
    simStage.addEventListener('mousemove', (e) => {
      const rect = simStage.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);

      const rotateX = -(y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;

      simPlate.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    simStage.addEventListener('mouseleave', () => {
      simPlate.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  }

  // Preset setter for Hotspot links
  window.setSimulatorPreset = function(styleKey, colorHex) {
    currentStyle = styleKey;
    currentColor = colorHex;

    styleButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.style === styleKey);
    });

    colorSwatches.forEach(s => {
      if (s.dataset.color.toLowerCase() === colorHex.toLowerCase()) {
        s.classList.add('active');
        currentColorName = s.dataset.name;
      } else {
        s.classList.remove('active');
      }
    });

    renderSimulator();
  };

  // WhatsApp order button from simulator
  if (btnOrderCurrentDesign) {
    btnOrderCurrentDesign.addEventListener('click', () => {
      const brand = simBrandInput ? simBrandInput.value.trim() : 'SIGN GLAZE';
      const tagline = simTaglineInput ? simTaglineInput.value.trim() : '';

      // Pre-fill quote form as well
      const clientCompanyInput = document.getElementById('clientCompany');
      const projectMessageInput = document.getElementById('projectMessage');
      if (clientCompanyInput) clientCompanyInput.value = brand;
      if (projectMessageInput) {
        projectMessageInput.value = `Simulated Design:\n- Sign Style: ${currentStyle.toUpperCase()}\n- LED Color: ${currentColorName}\n- Wall Texture: ${currentWall}\n- Text: "${brand}" / "${tagline}"`;
      }

      // Log lead to SQLite backend
      const formData = new FormData();
      formData.append('name', brand);
      formData.append('phone', 'Inquiry from Simulator');
      formData.append('company', brand);
      formData.append('sign_type', `${currentStyle.toUpperCase()} Sign`);
      formData.append('illumination', currentColorName);
      formData.append('mounting_surface', currentWall);
      formData.append('custom_text', `${brand} | ${tagline}`);
      formData.append('source', 'simulator');
      fetch('/api/leads', { method: 'POST', body: formData }).catch(() => {});

      const text = encodeURIComponent(
        `Hello Sign Glaze Technology,\n\nI just designed a sign on your website visualizer with the following specifications:\n- Brand Name: ${brand}\n- Sub-text: ${tagline}\n- Signage Style: ${currentStyle.toUpperCase()}\n- LED Color: ${currentColorName}\n- Preferred Mounting Surface: ${currentWall}\n\nPlease share fabrication cost estimates and lead time.`
      );
      window.open(`https://wa.me/919699428716?text=${text}`, '_blank');
    });
  }

  // Initial render
  renderSimulator();

  // ==========================================================================
  // 4. SMART COST ESTIMATOR & QUOTE GENERATOR
  // ==========================================================================
  const estWidth = document.getElementById('estWidth');
  const estHeight = document.getElementById('estHeight');
  const estWidthLabel = document.getElementById('estWidthLabel');
  const estHeightLabel = document.getElementById('estHeightLabel');
  const estType = document.getElementById('estType');
  const estLightingButtons = document.querySelectorAll('#estLightingPicker .option-btn');
  const estLocationButtons = document.querySelectorAll('#estLocationPicker .option-btn');

  const estPriceDisplay = document.getElementById('estPriceDisplay');
  const estAreaDisplay = document.getElementById('estAreaDisplay');
  const estMaterialDisplay = document.getElementById('estMaterialDisplay');
  const estLightingDisplay = document.getElementById('estLightingDisplay');
  const estWhatsappBtn = document.getElementById('estWhatsappBtn');

  let lightMult = 1.25;
  let envMult = 1.1;

  function calculateEstimate() {
    if (!estWidth || !estHeight || !estType) return;

    const w = parseInt(estWidth.value, 10);
    const h = parseInt(estHeight.value, 10);
    const area = w * h;

    if (estWidthLabel) estWidthLabel.textContent = `${w} Feet`;
    if (estHeightLabel) estHeightLabel.textContent = `${h} Feet`;
    if (estAreaDisplay) estAreaDisplay.textContent = `${area} Sq. Ft.`;

    const selectedOption = estType.options[estType.selectedIndex];
    const baseRate = parseFloat(selectedOption.dataset.rate || 1100);
    const materialName = selectedOption.text.split('(')[0].trim();

    if (estMaterialDisplay) estMaterialDisplay.textContent = materialName;

    const baseEstimate = area * baseRate * lightMult * envMult;
    const lowRange = Math.round((baseEstimate * 0.92) / 500) * 500;
    const highRange = Math.round((baseEstimate * 1.12) / 500) * 500;

    const formattedLow = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(lowRange);
    const formattedHigh = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(highRange);

    if (estPriceDisplay) {
      estPriceDisplay.textContent = `${formattedLow} - ${formattedHigh}`;
    }

    if (estLightingDisplay) {
      estLightingDisplay.textContent = lightMult > 1.0 ? 'LED Active (IP67 Modules)' : 'Non-Lit Direct Finish';
    }
  }

  if (estWidth) estWidth.addEventListener('input', calculateEstimate);
  if (estHeight) estHeight.addEventListener('input', calculateEstimate);
  if (estType) estType.addEventListener('change', calculateEstimate);

  estLightingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      estLightingButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lightMult = parseFloat(btn.dataset.rateMult || 1.0);
      calculateEstimate();
    });
  });

  estLocationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      estLocationButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      envMult = parseFloat(btn.dataset.rateEnv || 1.0);
      calculateEstimate();
    });
  });

  // Direct WhatsApp estimate dispatcher
  if (estWhatsappBtn) {
    estWhatsappBtn.addEventListener('click', () => {
      const w = estWidth ? estWidth.value : '8';
      const h = estHeight ? estHeight.value : '3';
      const area = parseInt(w, 10) * parseInt(h, 10);
      const selectedOption = estType.options[estType.selectedIndex];
      const mat = selectedOption.text;
      const price = estPriceDisplay ? estPriceDisplay.textContent.trim() : '';

      // Pre-fill quote form
      const projectLocationInput = document.getElementById('projectLocation');
      const projectMessageInput = document.getElementById('projectMessage');
      if (projectLocationInput) projectLocationInput.value = `${w}ft x ${h}ft (${area} sq. ft.)`;
      if (projectMessageInput) {
        projectMessageInput.value = `Calculated Estimate:\n- Material: ${mat}\n- Area: ${area} Sq. Ft. (${w}x${h} ft)\n- Estimated Range: ${price}`;
      }

      // Log lead to SQLite backend
      const formData = new FormData();
      formData.append('name', 'Cost Estimator Inquiry');
      formData.append('phone', 'Inquiry via Estimator');
      formData.append('sign_type', mat);
      formData.append('dimensions', `${w}ft x ${h}ft`);
      formData.append('area_sqft', area);
      formData.append('estimated_budget', price);
      formData.append('source', 'estimator');
      fetch('/api/leads', { method: 'POST', body: formData }).catch(() => {});

      const msg = encodeURIComponent(
        `Hello Sign Glaze Technology,\n\nI used your online signage cost estimator for a project:\n- Dimensions: ${w} ft x ${h} ft (${area} sq. ft.)\n- Signage Material: ${mat}\n- Estimated Range: ${price}\n- Location: Thane/Mumbai MMR\n\nCould you please send a detailed formal proposal or arrange a site survey?`
      );
      window.open(`https://wa.me/919699428716?text=${msg}`, '_blank');
    });
  }

  calculateEstimate();

  // ==========================================================================
  // 5. PORTFOLIO FILTERING
  // ==========================================================================
  const filterButtons = document.querySelectorAll('#portfolioFilterBar .filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || (item.dataset.category && item.dataset.category.includes(filter))) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 6. PORTFOLIO LIGHTBOX MODAL
  // ==========================================================================
  const modal = document.getElementById('projectModal');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalInquireBtn = document.getElementById('modalInquireBtn');

  let activeProjectTitle = '';

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title || item.querySelector('.portfolio-project-title').textContent;
      const specs = item.dataset.specs || '';
      const category = item.dataset.category || '';
      const img = item.dataset.img || item.querySelector('img').src;

      activeProjectTitle = title;

      if (modalImg) modalImg.src = img;
      if (modalTitle) modalTitle.textContent = title;
      if (modalSpecs) modalSpecs.textContent = specs;
      if (modalCategory) modalCategory.textContent = category.toUpperCase();

      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      const msg = encodeURIComponent(
        `Hello Sign Glaze Technology,\n\nI am interested in your project: "${activeProjectTitle}".\nPlease share more details, pricing, and material specifications for a similar setup.`
      );
      window.open(`https://wa.me/919699428716?text=${msg}`, '_blank');
      closeModal();
    });
  }

  // ==========================================================================
  // 7. CONTACT & RFQ FORM DISPATCHER (CONNECTED TO EXPRESS & SQLITE BACKEND)
  // ==========================================================================
  const quoteForm = document.getElementById('quoteForm');
  const btnSubmitForm = document.getElementById('btnSubmitForm');
  const btnSendFormWhatsapp = document.getElementById('btnSendFormWhatsapp');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  function getFormDataSummary() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const company = document.getElementById('clientCompany').value.trim();
    const category = document.getElementById('signageCategory').value;
    const location = document.getElementById('projectLocation').value.trim();
    const msg = document.getElementById('projectMessage').value.trim();
    const fileInput = document.getElementById('clientArtwork');
    const artwork = fileInput && fileInput.files ? fileInput.files[0] : null;

    return { name, phone, email, company, category, location, msg, artwork };
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = getFormDataSummary();

      if (!data.name || !data.phone) {
        alert('Please fill in your Name and Phone Number.');
        return;
      }

      if (btnSubmitForm) {
        btnSubmitForm.disabled = true;
        btnSubmitForm.innerHTML = '<span>⏳ Submitting to Workshop...</span>';
      }

      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('company', data.company);
        formData.append('sign_type', data.category);
        formData.append('location', data.location);
        formData.append('notes', data.msg);
        formData.append('source', 'quote_form');

        if (data.artwork) {
          formData.append('artwork', data.artwork);
        }

        const response = await fetch('/api/leads', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success && result.lead) {
          const leadId = result.lead.lead_id;
          if (formSuccessMessage) {
            formSuccessMessage.style.display = 'block';
            formSuccessMessage.innerHTML = `
              <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: #22c55e;">
                🎉 Inquiry Registered Successfully! Reference: <u>${leadId}</u>
              </div>
              <p style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 1rem;">
                Your project details and artwork have been saved directly to our fabrication queue. Our engineering team at Thane will review and contact you.
              </p>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <a href="https://wa.me/919699428716?text=Hi%20Sign%20Glaze%20Technology,%20I%20just%20submitted%20inquiry%20Ref%20${leadId}.%20Please%20check." target="_blank" rel="noopener" class="btn btn-whatsapp" style="font-size: 0.85rem;">
                  Chat on WhatsApp with Ref ${leadId}
                </a>
              </div>
            `;
            formSuccessMessage.scrollIntoView({ behavior: 'smooth' });
          }
          quoteForm.reset();
        } else {
          throw new Error(result.error || 'Failed to submit inquiry.');
        }
      } catch (err) {
        console.error('Submission error:', err);
        // Fallback to mailto
        if (formSuccessMessage) {
          formSuccessMessage.style.display = 'block';
          formSuccessMessage.innerHTML = `
            <div style="color: #ff6b35; font-weight: bold; margin-bottom: 0.5rem;">
              Direct Email Dispatch:
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Opening your default email client to send to <strong>sg_tech9@rediffmail.com</strong>...
            </p>
          `;
        }
        const subject = encodeURIComponent(`Signage RFP from ${data.name} (${data.company || 'Direct'})`);
        const bodyText = encodeURIComponent(
          `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nCompany: ${data.company}\nRequirement: ${data.category}\nLocation: ${data.location}\nDetails: ${data.msg}`
        );
        window.location.href = `mailto:sg_tech9@rediffmail.com?subject=${subject}&body=${bodyText}`;
      } finally {
        if (btnSubmitForm) {
          btnSubmitForm.disabled = false;
          btnSubmitForm.innerHTML = '<span>Send Quote Request</span>';
        }
      }
    });
  }

  if (btnSendFormWhatsapp) {
    btnSendFormWhatsapp.addEventListener('click', async () => {
      const data = getFormDataSummary();
      if (!data.name || !data.phone) {
        alert('Please enter at least your Name and Phone Number to connect on WhatsApp.');
        return;
      }

      // Also silently log lead to backend so it is never lost!
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('company', data.company);
        formData.append('sign_type', data.category);
        formData.append('location', data.location);
        formData.append('notes', data.msg);
        formData.append('source', 'whatsapp_click');
        if (data.artwork) formData.append('artwork', data.artwork);

        fetch('/api/leads', { method: 'POST', body: formData }).catch(() => {});
      } catch (e) {}

      const text = encodeURIComponent(
        `Hello Sign Glaze Technology,\n\nI am requesting a quotation with the following details:\n- Name: ${data.name}\n- Phone: ${data.phone}\n- Company: ${data.company || 'N/A'}\n- Signage Type: ${data.category}\n- Installation Location/Dimensions: ${data.location || 'To be surveyed'}\n- Notes: ${data.msg || 'None'}\n\nPlease let me know the next steps.`
      );
      window.open(`https://wa.me/919699428716?text=${text}`, '_blank');
    });
  }

  // ==========================================================================
  // 8. PARKING, ROAD & TRAFFIC SAFETY CATEGORY FILTERING & RFQ TRIGGER
  // ==========================================================================
  const trafficFilterBtns = document.querySelectorAll('.traffic-filter-btn');
  const trafficCards = document.querySelectorAll('.traffic-card');

  trafficFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      trafficFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCat = btn.dataset.trafficFilter;
      trafficCards.forEach(card => {
        if (filterCat === 'all' || card.dataset.trafficCat === filterCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Traffic product "Request Quote" buttons auto-populate contact form
  document.querySelectorAll('.traffic-card .rfq-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.dataset.product || 'Traffic Safety Product';
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      const signageCategory = document.getElementById('signageCategory');
      if (signageCategory) {
        signageCategory.value = 'Parking, Road & Traffic Safety Products';
      }

      const projectMessage = document.getElementById('projectMessage');
      if (projectMessage) {
        projectMessage.value = `Enquiry for ${productName}:\nPlease provide pricing quotation, technical data sheet, minimum order quantity, and delivery timeline for our site.`;
        projectMessage.focus();
      }
    });
  });

  // ==========================================================================
  // 12. BHIM UPI PAYMENT CLIPBOARD & ACTIONS
  // ==========================================================================
  const btnCopyUpi = document.getElementById('btnCopyUpi');
  const copyUpiLabel = document.getElementById('copyUpiLabel');
  const upiIdText = document.getElementById('upiIdText');

  if (btnCopyUpi && upiIdText) {
    btnCopyUpi.addEventListener('click', () => {
      const upiId = upiIdText.textContent.trim();
      const onCopied = () => {
        if (copyUpiLabel) {
          copyUpiLabel.textContent = '✓ Copied!';
          btnCopyUpi.style.borderColor = '#22c55e';
          btnCopyUpi.style.color = '#22c55e';
          setTimeout(() => {
            copyUpiLabel.textContent = '📋 Copy UPI ID';
            btnCopyUpi.style.borderColor = '';
            btnCopyUpi.style.color = '';
          }, 2500);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upiId).then(onCopied).catch(() => {
          fallbackCopy(upiId, onCopied);
        });
      } else {
        fallbackCopy(upiId, onCopied);
      }
    });
  }

  function fallbackCopy(text, callback) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksList = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksList.classList.toggle('nav-open');
    });

    navLinksList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('nav-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinksList.contains(e.target) && e.target !== mobileMenuBtn) {
        navLinksList.classList.remove('nav-open');
      }
    });
  }

});

