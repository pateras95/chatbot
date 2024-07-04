<template>
    <div id="app">
        <div id="container">
            <div id="bot" :class="{'speaking': text}">
                <div id="head">
                    <div id="left-ear">
                        <div id="left-ear-inner"></div>
                    </div>
                    <div id="face">
                        <div id="eyes">
                            <div id="left-eye"></div>
                            <div id="right-eye"></div>
                        </div>
                        <div id="mouth"></div>
                    </div>
                    <div id="right-ear">
                        <div id="right-ear-inner"></div>
                    </div>
                </div>
            </div>
        </div>
        <p class="spoken-text"  v-if="text">{{ text }}</p>
        <input type="text" v-model="transcript" placeholder="Enter your prompt..." />
        <button @click="generateText">Generate Text</button>

        <button @click="startListening">Start Listening</button>
        <p v-if="transcript">Transcript: {{ transcript }}</p>
    </div>
</template>

<script>
    import { GoogleGenerativeAI } from '@google/generative-ai'

    export default {
        data() {
            return {
                prompt: '',
                text: 'Hello, i am the museum bot\n,' +
                    ' how can i help you?',
                recognition: null,
                transcript: '',
                isListening: false
            }
        },
        mounted() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (!SpeechRecognition) {
                console.log('Speech Recognition API not supported in this browser.')
            }
            this.recognition = new SpeechRecognition()
            this.recognition.lang = 'en-US'
            this.recognition.continuous = true
            this.recognition.interimResults = true

            // Bind event handlers
            this.recognition.onresult = this.onSpeechResult
            this.recognition.onerror = this.onSpeechError
            this.recognition.onend = this.onSpeechEnd

            const utterance = new SpeechSynthesisUtterance(this.text)
            speechSynthesis.speak(utterance)
            utterance.onend = (event) => {
                this.text = '' // end animation
                this.startListening()
            }
        },
        methods: {
            async generateText() {
                const genAI = new GoogleGenerativeAI(process.env.VUE_APP_GOOGLE_GENAI_API_KEY)
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

                const result = await model.generateContent(this.transcript)
                const response = await result.response
                this.text = response.text()
                if (this.text !== '') {
                    this.speak()
                }
            },
            speak() {
                const utterance = new SpeechSynthesisUtterance(this.text)
                speechSynthesis.speak(utterance)
                utterance.onend = (event) => {
                    this.text = '' // end animation
                    this.startListening()
                }
            },
            startListening() {
                if (!this.isListening) {
                    this.recognition.start()
                    this.isListening = true
                    this.error = ''
                    // Start timeout to stop recognition after 10 seconds of silence
                    this.listeningTimeout = setTimeout(() => {
                        if (this.isListening) {
                            this.recognition.stop()
                            this.isListening = false
                        }
                    }, 10000) // Adjust timeout duration as needed
                } else {
                    this.recognition.stop()
                    this.isListening = false
                    clearTimeout(this.listeningTimeout)
                }
            },
            onSpeechResult(event) {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('')
                this.transcript = transcript
            },
            onSpeechError(event) {
                this.error = `Error occurred in recognition: ${event.error}`
                this.isListening = false
            },
            onSpeechEnd() {
                this.isListening = false
                console.log(this.transcript)
                this.generateText()
            }
        }
    }
</script>

<style>
/* Add some basic styling */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: #000;
  color: #FFF;
  margin-top: 60px;
}

.spoken-text{
  text-align: center;
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

#bot
{
  position: relative;
  text-align: left;
  width: 24em;
  height: 24em;
  min-width: 10em;
  min-height: 10em;
  /*border: 1px solid lightblue;*/
  margin: 0 auto;
}

#head
{
  position: relative;
  display: inline-block;
  margin-top: 15%;
  margin-left: 10%;
  width: 80%;
  height: 70%;
  /*border : 1px solid yellow;*/
}

#face
{
  position: absolute;
  margin-left: 0%;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  border: 0.4em solid #FFF;
  border-radius: 1.5em;
  /*border : 1px solid red;*/
}

#left-ear, #right-ear
{
  position: absolute;
  top: 30%;
  width: 6%;
  height: 25%;
  border: 0.15em solid #FFF;
  background-color: lightgray;
  border-radius: 0.1em;
}

#left-ear
{
  left: -6%;
}

#right-ear
{
  right: -10%;
}

#left-ear-inner, #right-ear-inner
{
  position: absolute;
  top: 20%;
  width: 100%;
  height: 60%;
  background-color: lightgray;
  border-radius: 0.1em;
}

#left-ear-inner
{
  left: -150%;
}

#right-ear-inner
{
  right: -150%;
}

#eyes
{
  position: absolute;
  width: 70%;
  height: 20%;
  margin-left: 16%; /* 16 */
  margin-top: 20%; /* 20 */
  /*border : 1px solid lightseagreen;*/
}

#left-eye, #right-eye
{
  position: absolute;
  width: 35%;
  height: 100%;
  background-color: lightseagreen;
  border-radius: 0.5em;
  /*border: 0.15em solid #FFF;*/
}

#right-eye
{
  right: 0%;
}

#mouth
{
  position: absolute;
  width: 30%;
  height: 4%;
  border-left: 0.2em solid #FFF;
  border-right: 0.2em solid #FFF;
  border-bottom: 0.2em solid #FFF;
  border-top: 0.0em solid #FFF;
  border-radius: 0.5em;
  left: 35%;
  bottom: 20%;
}

/* Animations */
#bot.neutral #left-eye, #bot.neutral #right-eye
{
  animation: blink-eyes 3s infinite ease-in alternate;
  animation-delay: 2s;
}

#bot.neutral #left-ear-inner
{
  animation: move-left-ear-inner 5.0s infinite ease alternate;
}

#bot.neutral #right-ear-inner
{
  animation: move-right-ear-inner 5.0s infinite ease alternate;
}

@keyframes blink-eyes {
  0%   { height: 10%; margin-top: 10%}
  10% { height: 100%; margin-top: 0%}
  100% { height: 100%; margin-top: 0%}
}

/* Speaking */
#bot.speaking #mouth
{
  border-top: 0.2em solid #FFF;
  background-color: #FFF;
  animation: speak-mouth 1.0s infinite ease alternate;
}

@keyframes speak-mouth {
  0%   { width: 10%; height: 4%; left: 45%;}
  25% { width: 30%; height: 10%; left: 35%;}
  50% { width: 6%; height: 4%; left: 47%;}
  75% { width: 40%; height: 8%; left: 30%;}
  100% { width: 30%; height: 4%; left: 35%;}
}

/* Waiting (Thinking) */
#bot.thinking #eyes
{
  animation: glance-eyes 8s infinite ease-in-out;
  animation-delay: 2s;
}

#bot.thinking #mouth
{
  animation: pinch-mouth 6.0s infinite ease alternate;
  animation-delay: 4s;
}

#bot.thinking #left-ear-inner
{
  animation: move-left-ear-inner 6.0s infinite ease alternate;
  animation-delay: 4s;
}

#bot.thinking #right-ear-inner
{
  animation: move-right-ear-inner 6.0s infinite ease alternate;
  animation-delay: 4s;
}

@keyframes glance-eyes {
  0%  { margin-left: 16%; }
  10% { margin-left: 6%; }
  40% { margin-left: 6%; }
  60% { margin-left: 24%; }
  70% { margin-left: 24%; }
  80% { margin-left: 16%; }
  100% { margin-left: 16%; }
}

@keyframes pinch-mouth {
  0%   { width: 30%; left: 35%; }
  48%  { width: 30%; left: 35%; }
  50%  { width: 10%; left: 45%; }
  52%  { width: 30%; left: 35%; }
  100% { width: 30%; left: 35%;}
}

@keyframes move-left-ear-inner {
  0%   { left: -150%; }
  48%  { left: -150%; }
  50%  { left: -100%; }
  52%  { left: -150%; }
  100% { left: -150%; }
}

@keyframes move-right-ear-inner {
  0%   { right: -150%; }
  48%  { right: -150%; }
  50%  { right: -100%; }
  52%  { right: -150%; }
  100% { right: -150%; }
}

/* Listening */
#bot.listening #left-eye, #bot.listening #right-eye
{
  background-color: lightgreen;
  border-radius: 1em;
  transition : border-radius 0.25s linear;
  animation: none;
}

#bot.listening #left-ear, #bot.listening #right-ear,
#bot.listening #left-ear-inner, #bot.listening #right-ear-inner
{
  background-color: lightgreen;
}

#bot.listening #face,
#bot.listening #left-ear, #bot.listening #right-ear
{
  border-color: lightgreen;
  transition : border-color 0.25s linear;
}

#bot.listening #left-ear-inner,
#bot.listening #right-ear-inner
{
  /*outline: 0.4em dotted lightgreen;*/
  animation: border-bump 0.4s infinite ease alternate;
  animation-delay: 0.5s;
}

@keyframes border-bump {
  0% {
    outline: 0.4em dotted lightgreen;
  }

  100% {
    outline: 0.2em dotted black;
  }
}

/* Computing */
#bot.computing #left-eye, #bot.computing #right-eye
{
  height: 100%;
  width: 25%;
  border-radius: 100%;
  transition : all 0.25s linear;
  border: 0.3em dashed black;
  animation-delay: 0.5s;
  background-color: #99FFFF;
}

#bot.computing #left-eye
{
  animation: border-dance 1s infinite linear reverse;
}

#bot.computing #right-eye
{
  animation: border-dance 1s infinite linear;
}

#bot.computing #face,
#bot.computing #left-ear, #bot.computing #right-ear,
#bot.computing #left-ear-inner, #bot.computing #right-ear-inner
{
  border-color: #99FFFF;
  transition : border-color 0.25s linear;
}

#bot.computing #left-ear, #bot.computing #right-ear,
#bot.computing #left-ear-inner, #bot.computing #right-ear-inner
{
  background-color: #99FFFF;
  transition : background-color 0.25s linear;
  animation: none;
}

#bot.computing #mouth
{
  border: 0.5em solid #FFF;
  width: 10%;
  left: 45%;
}

@keyframes border-dance {
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
