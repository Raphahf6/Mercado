const div = document.createElement('div')
const btnCarrinho = document.getElementById('modal')
const divModal = document.getElementById('modal-body')
const divCardapio = document.getElementById('cardapio')
const divBebidas = document.getElementById('cardapio-bebidas')
const urlProdutos = 'https://raphahf6.github.io/hamburgueria-mandrakao/db.json'
div.className = 'container'
const btnDark = document.getElementById('dark-mode')
const btnLight = document.getElementById('light-mode')

btnLight.addEventListener('click', () => {
    document.body.setAttribute('style', 'background-color: #EFD09E;')
    const tituloProdutos = document.querySelectorAll('div#titulo-produtos')
    for (i = 0; i < tituloProdutos.length; i++) {
        tituloProdutos[i].setAttribute('style', 'color: black;')

    }
})

btnDark.addEventListener('click', () => {
    document.body.setAttribute('style', 'background-color: #272932;')
    const tituloProdutos = document.querySelectorAll('div#titulo-produtos')
    for (i = 0; i < tituloProdutos.length; i++) {
        tituloProdutos[i].setAttribute('style', 'color: #F0F8EA;')

    }
})


class Carrinho {
    constructor() {
        this.id = []
        this.produtos = []
        this.total = 0
    }

    adicionaProdutoAoCarrinho(produto) {
        this.id.push(produto.id)
        this.produtos.push(produto)
        this.total += produto.preco
    }

    subtraiTotal(novoTotal) {
        this.total -= novoTotal
    }

    somaTotal(preco) {
        this.total += preco
    }

    removeProduto(produto) {
        this.produtos.splice(produto.id)

    }
}

let carrinho = new Carrinho()

class ProdutoNoCarrinho {
    constructor(nome, quantidade, preco, id) {
        this.nome = nome
        this.quantidade = quantidade
        this.preco = preco
        this.id = id
    }

    alteraQuantidade(novaQuantidade) {
        this.quantidade += novaQuantidade
    }

    alteraPreco(novoPreco) {
        this.preco += novoPreco
    }

}

const inputTotal = document.getElementById('total')


/*const footer = document.createElement('footer')
footer.className = 'container-fluid bg-dark text-light p-5 mt-3'
footer.innerHTML = `
                        <div class="d-flex bd-highlight">
                            <div class="mr-auto bd-highlight">
                        <p>Hamburgueria Mandrakao®</p>
                        </div>
                            <div class=" bd-highlight"><a href="#"><img src="assets/img/favicon.ico"
                                alt="Logo hamburgueria" class="brand-icon ml-auto"></a></div>
                            </div>
                            `

document.body.appendChild(footer) */



const btnLimparCarrinho = document.getElementById('limpar-carrinho')


btnLimparCarrinho.addEventListener('click', () => {
    limparCarrinho()
})

limparCarrinho = () => {
    carrinho.total = 0
    carrinho.produtos.splice(0, carrinho.produtos.length)
    inputTotal.value = carrinho.total
    divModal.innerHTML = ''
}


axios.get(urlProdutos)
    .then(response => {
        const api = response.data
        const { hamburgueres } = api

        const container = document.createElement('div')
        container.className = 'container'
        container.id = 'app'
        const divRow = document.createElement('div')
        divRow.className = 'row'



        for (i = 0; i < hamburgueres.length; i++) {
            let produtoAtual = hamburgueres[i]
            let divCard = document.createElement('div')
            divCard.className = 'col-sm-6 offset-sm-0 col-md-5 offset-md-0 col-lg-4 offset-lg-0 col-xl-3 offset-xl-0'
            divCard.innerHTML = ` 
                <div class="card text-center text-white bg-dark">
                    <img src="${produtoAtual.imgUrl}" class="card-img-top" alt="..." id="imgProduto">
                    <div class="card-body">
                        <h5 class="card-title">${produtoAtual.nome}</h5>
                        <p class="card-text">
                            Preço:<input value="${produtoAtual.preco}" class="preco text-black-50" id="preco-${produtoAtual.id}" disabled></p>


                        <div class="input-group mb-3">
                            <input type="text" class="form-control col-sm-12 col-md-12 col-lg-12 quantidade " id="quantidade-${produtoAtual.id}" placeholder="Quantidade"
                                aria-label="Digite a quantidade" aria-describedby="button-addon2">
                                <button title="Adiciona ao carrinho" type="button" class="btn col-sm-12 col-md-12 col-lg-12" id="comprar-${produtoAtual.id}">Adicionar ao carrinho</button>

                        </div>
                    </div>
                </div>
                `
            divRow.appendChild(divCard)
            container.appendChild(divRow)
            divCardapio.appendChild(container)

            const btnComprar = document.getElementById(`comprar-${produtoAtual.id}`)
            const inputQuantidade = document.getElementById(`quantidade-${produtoAtual.id}`)
            const inputPreco = document.getElementById(`preco-${produtoAtual.id}`).value

            btnComprar.addEventListener('click', () => {


                if (inputQuantidade.value === '') {
                    inputQuantidade.value = 1
                }

                event.preventDefault()
                let preco = inputPreco * inputQuantidade.value


                let novoProduto = new ProdutoNoCarrinho(produtoAtual.nome, inputQuantidade.value, preco, produtoAtual.id)
                if (carrinho.produtos.includes(novoProduto.id)) {
                    console.log('ja existe um produto igual no carrinho')
                }

                carrinho.produtos.push(novoProduto)
                carrinho.somaTotal(novoProduto.preco)
                inputTotal.value = carrinho.total

                const produtoHamburguer = document.createElement('div')
                produtoHamburguer.id = `${novoProduto.id}`
                produtoHamburguer.innerHTML = `<ul class="list-group" id="carrinho-${novoProduto.id}-${novoProduto.quantidade}" 
                style="list-style: none;"> <li id="carrinho-produtos-${novoProduto.id}"> 
                <img id="img-produto-carrinho" src="${produtoAtual.imgUrl}"> 
                Produto: ${novoProduto.nome} Quantidade: ${novoProduto.quantidade} 
                Preco: ${novoProduto.preco}<button type="button" class="btn-produtos" id="btn-produtos-${novoProduto.id}-${novoProduto.quantidade}">x</button><br>
                </li></ul>`

                divModal.appendChild(produtoHamburguer)

                let btnRemoveProduto = document.getElementById(`btn-produtos-${novoProduto.id}-${novoProduto.quantidade}`)

                btnRemoveProduto.addEventListener("click", () => {
                    let divCarrinho = document.getElementById(`carrinho-${novoProduto.id}-${novoProduto.quantidade}`)

                    divCarrinho.outerHTML = ''

                    carrinho.removeProduto(novoProduto)
                    carrinho.subtraiTotal(novoProduto.preco)
                    inputTotal.value = carrinho.total

                })


                alert(`${novoProduto.nome} Quantidade: ${novoProduto.quantidade} foi adicionado ao carrinho`)
                inputQuantidade.value = ''

            })


        }

    })

    .catch(err => {
        alert(`${err}`)
    })



axios.get(urlProdutos)
    .then(response => {
        const api = response.data
        const { bebidas } = api
        const container = document.createElement('div')
        container.className = 'container'
        container.id = 'app'
        const divRow = document.createElement('div')
        divRow.className = 'row'



        for (i = 0; i < bebidas.length; i++) {
            let produtoAtual = bebidas[i]
            let divCard = document.createElement('div')
            divCard.className = 'col-sm-12 offset-sm-0 col-md-5 offset-md-0 col-lg-4 offset-lg-0 col-xl-3 offset-xl-0'
            divCard.innerHTML = ` 
                <div class="card text-center text-white bg-dark">
                    <img src="${produtoAtual.imgUrl}" class="card-img-top" alt="..." id="imgProduto">
                    <div class="card-body">
                        <h5 class="card-title">${produtoAtual.nome}</h5>
                        <p class="card-text">
                            Preço:<input value="${produtoAtual.preco}" class="preco text-black-50" id="preco-${produtoAtual.id}" disabled></p>


                        <div class="input-group mb-3">
                            <input type="text" class="form-control col-sm-12 col-md-12 col-lg-12 quantidade" id="quantidade-${produtoAtual.id}" placeholder="Quantidade"
                                aria-label="Digite a quantidade" aria-describedby="button-addon2">
                                <button title="Adiciona ao carrinho" type="button" class="btn col-sm-12 col-md-12 col-lg-12" id="comprar-${produtoAtual.id}">Adicionar ao carrinho</button>


                        </div>
                    </div>
                </div>
                `
            divRow.appendChild(divCard)
            container.appendChild(divRow)
            divBebidas.appendChild(container)

            const btnComprar = document.getElementById(`comprar-${produtoAtual.id}`)
            const inputQuantidade = document.getElementById(`quantidade-${produtoAtual.id}`)
            const inputPreco = document.getElementById(`preco-${produtoAtual.id}`).value

            class ProdutoNoCarrinho {
                constructor(nome, quantidade, preco, id) {
                    this.nome = nome
                    this.quantidade = quantidade
                    this.preco = preco
                    this.id = id
                }
            }

            btnComprar.addEventListener('click', () => {


                if (inputQuantidade.value === '') {
                    inputQuantidade.value = 1
                }

                event.preventDefault()
                let preco = inputPreco * inputQuantidade.value


                let novoProduto = new ProdutoNoCarrinho(produtoAtual.nome, inputQuantidade.value, preco, produtoAtual.id)


                carrinho.produtos.push(novoProduto)
                carrinho.somaTotal(novoProduto.preco)
                inputTotal.value = carrinho.total


                const produtoBebida = document.createElement('div')
                produtoBebida.id = `${novoProduto.id}`
                produtoBebida.innerHTML = `<ul class="list-group" id="carrinho-${novoProduto.id}-${novoProduto.quantidade}" 
                style="list-style: none;"> <li id="carrinho-produtos-${novoProduto.id}"> 
                <img id="img-produto-carrinho" src="${produtoAtual.imgUrl}"> 
                Produto: ${novoProduto.nome} Quantidade: ${novoProduto.quantidade} 
                Preco: ${novoProduto.preco}<button type="button" class="btn-produtos" id="btn-produtos-${novoProduto.id}-${novoProduto.quantidade}">x</button><br>
                </li></ul>`


                divModal.appendChild(produtoBebida)

                let btnRemoveProduto = document.getElementById(`btn-produtos-${novoProduto.id}-${novoProduto.quantidade}`)

                btnRemoveProduto.addEventListener("click", () => {
                    let divCarrinho = document.getElementById(`carrinho-${novoProduto.id}-${novoProduto.quantidade}`)
                    divCarrinho.outerHTML = ''

                    carrinho.removeProduto(novoProduto)
                    carrinho.subtraiTotal(novoProduto.preco)
                    inputTotal.value = carrinho.total

                })

                alert(`${novoProduto.nome} Quantidade: ${novoProduto.quantidade} foi adicionado ao carrinho`)
                inputQuantidade.value = ''

            })


        }


    })
    .catch(err => {
        alert(`${err}`)
    })
