<template>
    <div id='alert-modal' tabindex='-1'
         class='fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'>
        <div class='relative w-full max-w-md max-h-full'>
            <div class='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                <div class='flex items-center justify-between p-5 rounded-t'>
                    <h3 class='text-xl font-medium text-gray-900 dark:text-white'>
                        Внимание!
                    </h3>
                    <button type='button'
                            class='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                            @click='closeModal'
                    >
                        <svg aria-hidden='true' class='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'
                             xmlns='http://www.w3.org/2000/svg'>
                            <path fill-rule='evenodd'
                                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                  clip-rule='evenodd'></path>
                        </svg>
                        <span class='sr-only'>Close modal</span>
                    </button>
                </div>
                <div class='p-6 space-y-6'>
                    <p class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
                        <slot></slot>
                    </p>
                </div>
                <div class='flex items-center p-6 space-x-2 rounded-b justify-end'>
                    <div class='relative z-0 w-full mb-6 group'>
                        <input type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' name='floating_phone' id='floating_phone'
                               v-model='confirm'
                               :class='{
                                   "border-red-600 dark:border-red-500 focus:border-red-600 dark:focus:border-red-600 text-red-600 dark:text-gray-500": wrongConfirm
                               }'
                               @keydown.enter='acceptModal'
                               class='block py-2.5 px-0 w-[80%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                               placeholder=' ' required />
                        <label for='floating_phone'
                               :class='{
                                   "text-red-600 dark:text-red-500 peer-focus:text-red-600 peer-focus:dark:text-red-500": wrongConfirm
                               }'
                               class='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                            Введите "{{ toRemove }}" для подтверждения</label>
                    </div>
                    <button type='button' @click='acceptModal'
                            :class='{
                                "opacity-50": confirm.toUpperCase().trim() !== toRemove
                            }'
                            class='text-white bg-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700'>
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, defineProps, defineEmits, watch, ref } from 'vue';
import { Modal, initFlowbite } from 'flowbite';

let confirm = ref('');
let wrongConfirm = ref(false);

const props = defineProps({
    value: {
        type: Boolean,
        default: false,
        required: true
    },
    toRemove: {
        type: String,
        default: '',
        required: true
    }
});

const emits = defineEmits({
    accept: (value) => typeof value === 'boolean',
    decline: (value) => typeof value === 'boolean'
});

const closeModal = () => {
    emits('decline', true);
    confirm.value = '';
    wrongConfirm.value = false;
};

const acceptModal = () => {
    if (confirm.value.toUpperCase().trim() === props.toRemove) {
        emits('accept', true);
        confirm.value = '';
        wrongConfirm.value = false;
    } else {
        wrongConfirm.value = true;
    }
};

onMounted(() => {
    initFlowbite();

    const $modal = document.querySelector('#alert-modal');

    const modalOptions = {
        placement: 'top-center',
        backdrop: 'dynamic',
        backdropClass: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
        closable: true,

        onHide: () => {
            closeModal();
        }
    };

    const modal = new Modal($modal, modalOptions);

    watch(() => props.value, (newValue) => {
        if (newValue) {
            modal.show();
        } else {
            modal.hide();
        }
    });
});
</script>