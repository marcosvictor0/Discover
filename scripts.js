const Modal = {
    open(){
        //abrir modal
        //adicionar a class active ao modal
        document
                .querySelector('.modal-overlay') //essa linha passa um argumento para o document procurar no codigo todo sobre o "modal-overlay".
                .classList
                .add('active') //coloca um argumento um nome da classe que eu quero que ele adicione.
    },
    close(){
        //fechar o modal
        //remover a classe active do modal
        document
                .querySelector('.modal-overlay') //essa linha passa um argumento para o document procurar no codigo todo sobre o "modal-overlay".
                .classList
                .remove('active') //coloca um argumento um nome da classe que eu quero que ele adicione.
    }
} //Criação de uma funcionalidade dentro do objeto
//ALT + SHIF + SETINHA PRA BAIXO PRA COPIAR PARA LINHA DE BAIXO.

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set (transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add (transaction){
        Transaction.all.push(transaction)
        
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        //pegar todas as transações 
        //para cada transação
        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount > 0 ) {
                //somar a uma variavel e retornar a variável.
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
            let expense = 0;
            //pegar todas as transações
            //para cada transação,
            Transaction.all.forEach(transaction => {
                //se ela for maior que zero
                if( transaction.amount < 0 ) {
                    //somar a uma variável e retornar a várivel
                    expense += transaction.amount
                }
            })
            return expense;
    },

    total() {

        return Transaction.incomes() + Transaction.expenses()
    }
}

//DOM = Document object Model

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr') //Criando um elemento na DOM, 
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

       DOM.transactionsContainer.appendChild(tr) //funcionalidade da DOM, que serve para adicionar 

    },
//uma função, para que eu possa usar ela em outro lugar, eu preciso tirar as coisas dentro dela, através da palavra RETURN
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
//Interpolação = ${}
        const html = 
        ` 
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>

            <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
            .getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
            .getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-") //splitted e uma separação onde estiver o - .
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        //esse /\D/, ele vai procurar tudo que for número. E o /g é global.
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency", //estilo moeda
            currency: "BRL"
        }) // é uma funcionalidade que ja vem no JS

        return signal + value
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        //trim = fazer uma limpeza dos espaços vazios

        if(description.trim() === "" || 
        amount.trim() === "" || 
        date.trim() === "") {
            // é como se fosse empurrar, jogar pra fora, algo desse tipo    
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount) 
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date,
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault() // não mostrar na aba do navegador, as informações que o usuário vai digitar/enviar

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
        /* 
            verificar se todas as informações foram preenchidas
            formatar os dados para salvar
            salvar os dados
            apagar os dados do formulário
            modal feche
            atuaizar a aplicação
        */
    }
}

const App = {
    init() {

        Transaction.all.forEach(function(transaction, index) {
            DOM.addTransaction(transaction, index);
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
            DOM.clearTransactions()
            App.init()
    },
}

App.init()

/*
Transaction.add({

    description: "Oii",
    amount: 45000,
    date: "12/03/2021"

})

o que estava no all: anteriormente : 
[
    {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        description: 'Criação de Website',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        description:'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
], // Array
*/