const card_template = (card) => {
	return `
    <div class="progress-card ${card.state}">
        <label for="${card.subject}">${card.subject}</label>
        <div class="progress-bar-wrapper">
            <div class="progress-card-info">
                <p>${card.start_date}</p>
                <p>${card.end_date}</p>
            </div>
            <progress value="${card.value}" max="100" id="${card.subject}"></progress>
        </div>
    </div>
    `;
};

const section_template = (title, cards) => {
	return `
    <section>
        <div class="card-container">
            <h2>${title.toUpperCase()}</h2>
            ${cards}
        </div>
    </section>
    `;
};

const current_progress_value = (start_date, end_date) => {
	const start_date_ms = new Date(start_date).getTime();
	const end_date_ms = new Date(end_date).getTime();
	const current_date_ms = new Date().getTime();
	const progress = Math.round(((end_date_ms - current_date_ms) / (end_date_ms - start_date_ms)) * 100);
	return progress < 0 ? 100 : progress;
};

fetch("./data.json")
	.then((response) => response.json())
	.then((data) => {
		const html = Object.entries(data).map(([title, subjects]) =>
			section_template(
				title,
				subjects.map((subject) =>
					card_template({
						state: subject.state,
						value: current_progress_value(subject.start_date, subject.end_date),
						subject: subject.title,
						start_date: subject.start_date,
						end_date: subject.end_date,
					})
				)
			)
		);
		document.body.innerHTML += html.toString().replace(/,/g, "");

		const approved_cnt = document.querySelectorAll(".approved").length;
		document.querySelector("#completed_subjects").textContent = `Ing. Electrónico (${approved_cnt}/45)`;
	});
