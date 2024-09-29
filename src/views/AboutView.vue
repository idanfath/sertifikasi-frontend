<!-- store inside indexedDB -->

<template>
    <main class="about">
        <div class="flex flex-wrap gap-5 p-5 w-full justify-center">
            <x-input v-model="search" type="text" placeholder="Search datas" />
            <div v-for="item in filteredData" :key="item.id" class="bg-white shadow-md rounded-lg p-6 mb-4 post-card">
                <h2 class="text-2xl font-bold mb-2 truncate">{{ item.title }}</h2>
                <p class="text-gray-700 mb-4 overflow-hidden overflow-ellipsis line-clamp-3">
                    {{ item.body }}
                </p>
                <div class="flex flex-wrap mb-4">
                    <span v-for="tag in item.tags" :key="tag"
                        class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{{ tag
                        }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-600 text-sm">
                    <p><span class="font-semibold">Likes:</span> {{ item.reactions.likes }}</p>
                    <p><span class="font-semibold">Dislikes:</span> {{ item.reactions.dislikes }}</p>
                    <p><span class="font-semibold">Views:</span> {{ item.views }}</p>
                    <p><span class="font-semibold">User ID:</span> {{ item.userId }}</p>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.post-card {
    /* make it a card */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0px 0 rgba(0, 0, 0, 0.1);
    border: 1.5px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    max-width: 500px;
}

.post-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.1);
}
</style>

<script>

import axios from 'axios';

export default {
    data() {
        return {
            title: 'About',
            search: '',
            data: []
        }
    },
    methods: {
        async fetchData() {
            const response = await axios.get('https://dummyjson.com/posts')
            if (response) { this.data = response.data; }
        }
    },
    computed: {
        /**
         * @function filteredData
         * Filters the posts data based on the search query.
         *
         * @returns {Array} The filtered list of posts.
         *
         * This method performs the following:
         * - If `this.data.posts` is not available, it returns an empty array.
         * - If `this.search` is not provided, it returns the original list of posts.
         * - Filters the posts based on the specified fields (`body`, `title`, `tags`, `userId`).
         * - Returns posts where any of the specified fields contain the search query (case-insensitive).
         */
        filteredData() {
            if (!this.data.posts) return [];
            if (!this.search) return this.data.posts;
            /**
             * @note
             * Use this method to filter the posts based on whitelisted fields.
             */
            const fields = ['body', 'title', 'tags', 'userId'];
            return this.data.posts.filter((item) => {
                return fields.some((field) => {
                    return String(item[field]).toLowerCase().includes(this.search.toLowerCase());
                });
            });
            /**
             * @note
             * to filter the posts based on all fields, use the following code:
             *
             * return this.data.posts.filter((item) => {
             *      return Object.values(item).some((field) => {
             *         return String(field).toLowerCase().includes(this.search.toLowerCase());
             *     });
             * });
             *
             * @note
             * to filter the posts based on a single field, use the following code:
             *
             * return this.data.posts.filter((item) => {
             *      return String(item.title).toLowerCase().includes(this.search.toLowerCase());
             * });
             */
        }
    },
    async mounted() {
        await this.fetchData();
    }
}

</script>
