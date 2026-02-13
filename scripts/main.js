document.addEventListener('DOMContentLoaded', () => {
    console.log('Verify AI Loaded');

    // --- Navigation Smooth Scroll & Active Highlighting ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll spy - update nav based on scroll position
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // --- Detection Logic ---
    const uploadArea = document.getElementById('uploadArea');

    // Only run detection logic if elements exist (Home Page)
    if (uploadArea) {
        const fileInput = document.getElementById('fileInput');
        const previewArea = document.getElementById('previewArea');
        const imagePreview = document.getElementById('imagePreview');
        const videoPreview = document.getElementById('videoPreview');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resetBtn = document.getElementById('resetBtn');
        const scanOverlay = document.getElementById('scanOverlay');
        const resultsDashboard = document.getElementById('resultsDashboard');

        // UI Elements for Results
        const elements = {
            verdict: document.getElementById('verdictDisplay'),
            confidenceVal: document.getElementById('confidenceValue'),
            confidenceBar: document.getElementById('confidenceBar'),
            metaType: document.getElementById('metaType'),
            metaName: document.getElementById('metaName'),
            metaSize: document.getElementById('metaSize'),
            metaRes: document.getElementById('metaRes'),
            metaFormat: document.getElementById('metaFormat'),
            aiSummary: document.getElementById('aiSummary'),
            reportId: document.getElementById('reportId')
        };

        let currentFile = null;

        // --- Event Listeners ---

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File Input Change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        });

        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        uploadArea.addEventListener('dragover', () => uploadArea.classList.add('dragover'));
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        // Reset
        resetBtn.addEventListener('click', resetApp);

        // Analyze
        analyzeBtn.addEventListener('click', startAnalysis);

        // --- Functions ---

        function handleFiles(files) {
            if (files.length === 0) return;
            const file = files[0];

            // Validate file type
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                alert('Please upload an image or video file.');
                return;
            }

            currentFile = file;

            // Show Preview
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadArea.classList.add('hidden');
                previewArea.classList.remove('hidden');

                if (file.type.startsWith('video')) {
                    videoPreview.src = e.target.result;
                    videoPreview.classList.remove('hidden');
                    imagePreview.classList.add('hidden');
                } else {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                    videoPreview.classList.add('hidden');
                }

                // Reset results if they were shown
                resultsDashboard.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }

        function resetApp() {
            currentFile = null;
            fileInput.value = ''; // Clear input to allow re-uploading same file
            uploadArea.classList.remove('hidden');
            previewArea.classList.add('hidden');
            resultsDashboard.classList.add('hidden');
            scanOverlay.classList.add('hidden');

            videoPreview.src = "";
            imagePreview.src = "";

            // Reset button state
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Check Authenticity';
        }

        async function startAnalysis() {
            if (!currentFile) return;

            // UI Updates
            scanOverlay.classList.remove('hidden');
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';

            const formData = new FormData();
            formData.append('file', currentFile);

            try {
                const response = await fetch('http://127.0.0.1:8000/predict-image', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                finishAnalysis(data);

            } catch (error) {
                console.error("Analysis failed:", error);
                alert("Analysis failed. Please ensure the backend server is running on port 8000.");

                // Reset UI state on error
                scanOverlay.classList.add('hidden');
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Check Authenticity';
            }
        }

        function finishAnalysis(data) {
            scanOverlay.classList.add('hidden');
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Check Authenticity';
            resultsDashboard.classList.remove('hidden');

            // Scroll to results
            resultsDashboard.scrollIntoView({ behavior: 'smooth' });

            // Parse Data
            const result = data.result; // "Real", "Fake", or "Unverified"
            const confidence = data.confidence;

            // Populate Data
            elements.reportId.innerText = Math.floor(Math.random() * 90000) + 10000; // Random ID for report

            if (result === "Unverified") {
                elements.verdict.innerHTML = '<i class="fa-solid fa-circle-question"></i> <span>UNVERIFIED</span>';
                elements.verdict.className = 'verdict-display';
                elements.verdict.style.color = 'var(--text-muted)';
                elements.verdict.style.borderColor = 'var(--text-muted)';

                elements.confidenceBar.style.background = 'gray';
                elements.aiSummary.innerText = `> ${data.prediction || "Model needs training to analyze this file."}`;
            } else if (result === "Fake") {
                elements.verdict.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span>AI-GENERATED</span>';
                elements.verdict.className = 'verdict-display fake';
                elements.confidenceBar.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
            } else { // result === "Real"
                elements.verdict.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>AUTHENTIC</span>';
                elements.verdict.className = 'verdict-display real';
                elements.confidenceBar.style.background = 'linear-gradient(90deg, #34d399, #10b981)';
            }

            // AI Analysis Log - Display detailed metadata
            const metadata = data.metadata || {};
            let analysisLog = '';

            if (result === "Fake" && metadata.ai_platform) {
                // AI-Generated: Show platform
                analysisLog = `> AI Platform Detected: ${metadata.ai_platform}\n`;
                analysisLog += `> Generation Source: ${metadata.ai_platform} AI Generator\n`;
                analysisLog += `> Verdict: Synthetic/AI-Generated Content`;
            } else if (result === "Fake" && !metadata.ai_platform) {
                // AI-Generated but platform unknown
                analysisLog = `> Analysis detected synthetic patterns consistent with AI generation.\n`;
                analysisLog += `> Platform: Unknown (metadata stripped or not embedded)\n`;
                analysisLog += `> Verdict: Likely AI-Generated`;
            } else if (result === "Real") {
                // Authentic: Show device and timestamp
                if (metadata.device_make || metadata.device_model) {
                    // Build device info line by line
                    let deviceParts = [];
                    if (metadata.device_make) deviceParts.push(metadata.device_make);
                    if (metadata.device_model) deviceParts.push(metadata.device_model);

                    analysisLog = `> Device: ${deviceParts.join(' ')}\n`;

                    if (metadata.lens_info) {
                        analysisLog += `> Lens: ${metadata.lens_info}\n`;
                    }

                    if (metadata.datetime) {
                        analysisLog += `> Captured: ${metadata.datetime}\n`;
                    } else {
                        analysisLog += `> Captured: Date/time not recorded by device\n`;
                    }

                    analysisLog += `> Verdict: Authentic photograph from camera`;
                } else {
                    analysisLog = `> No artificial artifacts detected.\n`;
                    analysisLog += `> Noise patterns appear natural.\n`;

                    if (metadata.has_metadata) {
                        analysisLog += `> Note: Camera info not available in metadata`;
                    } else {
                        analysisLog += `> Note: All metadata stripped (likely downloaded/re-saved image)`;
                    }
                }
            } else {
                // Unverified
                analysisLog = `> ${data.prediction || "Model needs training to analyze this file."}`;
            }

            elements.aiSummary.innerText = analysisLog;

            elements.confidenceVal.innerText = `${confidence}%`;
            elements.confidenceBar.style.width = `${confidence}%`;

            // Metadata
            elements.metaType.innerText = currentFile.type || 'Unknown';
            elements.metaName.innerText = currentFile.name.length > 20 ? currentFile.name.substring(0, 20) + '...' : currentFile.name;
            elements.metaSize.innerText = currentFile.size ? (currentFile.size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A';
            elements.metaFormat.innerText = currentFile.name.split('.').pop().toUpperCase();

            // Simple check for Image resolution if possible, otherwise generic
            if (currentFile.type.startsWith('image')) {
                const img = new Image();
                img.onload = function () {
                    elements.metaRes.innerText = `${this.width} x ${this.height}`;
                };
                img.src = URL.createObjectURL(currentFile);
            } else {
                elements.metaRes.innerText = "Video File";
            }
        }
    }
});
