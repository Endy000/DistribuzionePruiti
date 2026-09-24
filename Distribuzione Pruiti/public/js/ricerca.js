const input = document.getElementById("search");
const container = document.getElementById("spazioc");

let timeout;


// LEGGE I FILTRI
function getFilters() {

    const getChecked = (name) =>
        [...document.querySelectorAll(`input[name="${name}"]:checked`)]
            .map(el => el.value);

    return {
        search: input.value,
        tipologia: getChecked("tipologia"),
        stile: getChecked("stile"),
        marca: getChecked("marca"),
        disegno: getChecked("disegno")
    };
}


// CREA QUERY PARAMS
function buildParams(filters){

    const params = new URLSearchParams();

    for(const key in filters){

        const value = filters[key];

        if(Array.isArray(value)){

            value.forEach(v=>{
                params.append(key,v);
            });

        } else if(value){

            params.append(key,value);

        }
    }

    return params;
}


// FETCH PRODOTTI
async function loadProducts() {

    clearTimeout(timeout);

    timeout = setTimeout(async () => {

        const filters = getFilters();

        const params = buildParams(filters);

        const res = await fetch(`/api/copertoni?${params}`);

        const data = await res.json();

        render(data);

    }, 200);
}


// RENDER
function render(data) {

    container.innerHTML = "";

    data.forEach(c => {

        const div = document.createElement("div");

        div.className = "copertone";

        div.innerHTML = `
            <img src="./Assets/Shop_Assets/${c.ID}.jpeg">
            <h1 class="h1">${c.Nome}</h1>
            <h2 class="h2">${c.Marca}</h2>
            <p class="p">${c.Prezzo} €</p>
        `;

        container.appendChild(div);

    });
}


// EVENTI
input.addEventListener("input", loadProducts);

document.querySelectorAll("input[type=checkbox]")
.forEach(cb => {
    cb.addEventListener("change", loadProducts);
});