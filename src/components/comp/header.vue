<template>
    <header class="header">
        <div class="header-container">
            <nav class="nav">
                <div class="flex items-center">
                    <router-link :to="{ name: 'home' }" class="logo">
                        <img src="@/assets/logo.svg" alt="Logo" class="logo-image" />
                        <span class="logo-text">{{ appdata.title }}</span>
                    </router-link>
                    <ul class="nav-links ml-6">
                        <li v-for="link, index in navLinks" :key="index">
                            <router-link :to="{ name: link.name }" activeClass="nav-active" class="nav-link my-bezier">
                                <span>
                                    {{ link.text }}
                                </span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>


</template>

<script>
export default {
    name: 'comp-header',
    data() {
        return {
            appdata,
            navLinks: [
                { text: 'Home', name: 'home' },
                { text: 'About', name: 'about' },
                { text: 'Login', name: 'login' },
                { text: 'Item', name: 'item' },
            ],
        }
    },
    methods: {
    },
}
</script>

<style scoped>
.header {
    @apply shadow-md;
    /* glass effect */
    /* background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px); */
}

.header-container {
    @apply px-4 w-full;
}

.nav {
    @apply flex items-center justify-between h-16;
}

.logo {
    @apply flex items-center;
}

.logo-image {
    @apply h-7 w-7;
}

.logo-text {
    @apply ml-2 text-lg font-bold;
}

.nav-links {
    @apply hidden md:flex space-x-5;
}

.nav-link {
    @apply relative text-gray-500 hover:text-black transition-colors duration-500;
}

.nav-link::after {
    content: '';
    @apply absolute left-0 bottom-[-1px] w-full h-[1.5px] bg-neutral-700 origin-left scale-x-0;
    transition: transform 0.5s cubic-bezier(.7, 0, .25, 1);
    cursor: default;
}

.nav-link:hover::after {
    @apply scale-x-100;
}

.nav-active {
    @apply text-black;
}


.menu-icon {
    @apply h-6 w-6 text-gray-800;
}

@screen md {
    .nav-links {
        @apply flex;
    }

    .menu-toggle {
        @apply hidden;
    }
}
</style>
