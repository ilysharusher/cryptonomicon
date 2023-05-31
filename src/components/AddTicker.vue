<template>
    <section>
        <div class='flex'>
            <div class='max-w-xs'>
                <label for='wallet' class='block text-sm font-medium text-gray-700'
                >Добавить криптовалюту</label
                >
                <div class='mt-1 relative rounded-md shadow-md'>
                    <input
                        v-model='ticker'
                        @input='changeTicker'
                        @keydown.enter='add'
                        type='text'
                        name='wallet'
                        id='wallet'
                        class='block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md'
                        placeholder='Например BTC'
                    />
                </div>
                <div
                    v-if='suggest.length'
                    class='flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap justify-center'
                >
                            <span
                                v-for='(s, id) in suggest.slice(0, 4)'
                                :key='id'
                                @click='addSuggest(s)'
                                class='inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer'
                            >
                                {{ s }}
                            </span>
                </div>
                <div v-if='suggestError' class='text-sm text-red-600'>
                    Такая криптовалюта уже добавлена
                </div>
                <div v-if='nonExistent' class='text-sm text-red-600'>
                    Такой криптовалюты не существует
                </div>
            </div>
        </div>
        <add-button @click='add' :disabled='disabled' />
    </section>
</template>

<script>
import AddButton from './AddButton.vue';

export default {
    components: {
        AddButton
    },

    props: {
        disabled: {
            type: Boolean,
            default: false,
            required: false
        },
        tickers: {
            type: Array,
            default: () => [],
            required: false
        }
    },

    emits: {
        'add-ticker': value => typeof value === 'string' && value.length > 0
    },

    data() {
        return {
            ticker: '',
            coins: null,
            suggest: [],
            suggestError: false,
            nonExistent: false
        };
    },

    created: async function() {
        this.coins = await (
            await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
        ).json();
    },

    methods: {
        add() {
            if (this.ticker.length) {
                this.$emit('add-ticker', this.ticker);
                this.ticker = '';
            }
        },

        addSuggest(ticker) {
            this.ticker = ticker;

            this.add();
        },

        changeTicker() {
            this.suggestError = false;
            this.nonExistent = false;

            if (this.ticker.length) {
                this.suggest = Object.values(this.coins.Data)
                    .filter(
                        (coin) =>
                            (coin.Symbol.toLowerCase().includes(this.ticker.toLowerCase()) ||
                                coin.FullName.toLowerCase().includes(this.ticker.toLowerCase())) &&
                            !this.tickers.find((t) => t.name === coin.Symbol)
                    )
                    .map((coin) => coin.Symbol);
            } else {
                this.suggest = [];
            }
        }
    }
};
</script>