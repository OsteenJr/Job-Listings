let jobs = [];
let activeFilters = [];

document.addEventListener('DOMContentLoaded', function () {
    const jobsContainer = document.getElementById('jobsContainer');
    const filterContainer = document.getElementById('filterContainer');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const clearBtn = document.getElementById('clearBtn');

    filterContainer.classList.add('hidden');

    clearBtn.addEventListener('click', function () {
        activeFilters = [];
        updateFilters();
        filterJobs();
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jobs = data;
            displayJobs(jobs);
        })
        .catch(error => {
            jobsContainer.innerHTML = `<p> Couldn't load the jobs. ${error}</p>`;
        });

    function displayJobs(jobsToDisplay) {
        jobsContainer.innerHTML = '';

        if (jobsToDisplay.length === 0) {
            jobsContainer.innerHTML = `<p class="no-results">No jobs found.</p>`;
            return;
        }

        jobsToDisplay.forEach(job => {
            const allTags = [job.role, job.level, ...job.languages, ...job.tools];

            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');

            if (job.featured) {
                jobCard.classList.add('featured');
            }

            jobCard.innerHTML = `
                <img class="company-logo" src="${job.logo}" alt="${job.company} logo">
                <div class="job-details">
                    <div class="company-row">
                        <span class="company-name">${job.company}</span>
                        <div class="badges">
                            ${job.new ? '<span class="badge new">New!</span>' : ''}
                            ${job.featured ? '<span class="badge featured">Featured</span>' : ''}
                        </div>
                    </div>
                    <h2 class="position">${job.position}</h2>
                    <div class="job-info">
                        <span>${job.postedAt}</span>
                        <span>•</span>
                        <span>${job.contract}</span>
                        <span>•</span>
                        <span>${job.location}</span>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="job-tags">
                    ${allTags.map(tag => `<div class="tag" data-tag="${tag}">${tag}</div>`).join('')}
                </div>
            `;

            jobsContainer.appendChild(jobCard);

            const tagElements = jobCard.querySelectorAll('.tag');
            tagElements.forEach(tagElement => {
                tagElement.addEventListener('click', function () {
                    const tag = this.getAttribute('data-tag');
                    if (!activeFilters.includes(tag)) {
                        activeFilters.push(tag);
                        updateFilters();
                        filterJobs();
                    }
                });
            });
        });
    }
  function updateFilters() {
        activeFiltersContainer.innerHTML = '';
    
        if (activeFilters.length === 0) {
            filterContainer.classList.add('hidden');
            return;
        }
        filterContainer.classList.remove('hidden');
        activeFilters.forEach(filter => {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.innerHTML = `
            <span>${filter}</span>
            <button data-filter="${filter}">✕</button>
            `;
      
            activeFiltersContainer.appendChild(filterTag);
            const removeBtn = filterTag.querySelector('button');
            removeBtn.addEventListener('click', function() {
            const filterToRemove = this.getAttribute('data-filter');
            activeFilters = activeFilters.filter(f => f !== filterToRemove);
            updateFilters();
            filterJobs();
         });
    });
  }
  function filterJobs() {
    if (activeFilters.length === 0) {
      displayJobs(jobs);
      return;
    }
    
    const filteredJobs = jobs.filter(job => {
      const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
      
      return activeFilters.every(filter => jobTags.includes(filter));
    });
    
    displayJobs(filteredJobs);
  }
});
     
