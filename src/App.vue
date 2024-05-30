<template>
    <div id="app">
        <input type="text" v-model="prompt" placeholder="Enter your prompt..." />
        <button @click="generateText">Generate Text</button>
        <p v-if="text">{{ text }}</p>
    </div>
</template>

<script>
    import { GoogleGenerativeAI } from '@google/generative-ai'

    export default {
        data() {
            return {
                prompt: '',
                text: ''
            }
        },
        methods: {
            async generateText() {
                const genAI = new GoogleGenerativeAI(process.env.VUE_APP_GOOGLE_GENAI_API_KEY)
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

                const result = await model.generateContent(this.prompt)
                const response = await result.response
                this.text = response.text()
            }
        }
    }
</script>

<style>
/* Add some basic styling */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

input {
  padding: 10px;
  font-size: 16px;
  margin-right: 10px;
}

button {
  padding: 10px;
  font-size: 16px;
}

p {
  margin-top: 20px;
  font-size: 18px;
}
</style>
