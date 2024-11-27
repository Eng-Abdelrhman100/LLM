import { useState } from 'react';
// import dotenv from 'dotenv';

// Load environment variables from .env file
// dotenv.config();
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { CohereClientV2 } from 'cohere-ai'; // Import CohereClient from cohere-ai
// import { FaPaperclip } from 'react-icons/fa';




// Initialize the Cohere client with your API key
const cohere = new CohereClientV2({
  token: 'paB0bQ1U29yjw582HA4qJ1WZVr7nLUkogbz2BXTG', // Your API key
});

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Cohere! Ask me anything!",
      sentTime: "just now",
      sender: "Cohere",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  

  // Handle sending messages
  const handleSend = async (message) => {
    const prompt = message;

    // Add user's message to the chat
    const newMessage = {
      message: prompt,
      direction: 'outgoing',
      sender: 'user',
    };

  


    // Update chat messages state
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    // Show typing indicator while waiting for response
    setIsTyping(true);

    // Process the message and get the response from Cohere API
    await processPromptToCohere(newMessages, prompt);
  };

  async function processPromptToCohere(chatMessages, prompt) {
    try {
      // Send request to Cohere's chat API
      const response = await cohere.chat({
        model: 'command-r-plus-08-2024',  // Make sure the model exists
        messages: [{ role: 'user', content: prompt }],
      });
  
      // Log the full response to inspect its structure
      console.log('Cohere response:', response);
  
      // Check if the response has message content and it's an array
      if (response && response.message && Array.isArray(response.message.content) && response.message.content.length > 0) {
        const reply = response.message.content[0].text; // Get the content of the first item in the array
  
        // Update the messages state with the response from Cohere
        setMessages([...chatMessages, {
          message: reply,
          sender: 'Cohere',
        }]);
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching from Cohere:', error);
    } finally {
      // Stop typing indicator
      setIsTyping(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-4 text-white text-2xl font-semibold rounded-t-3xl flex items-center justify-center">
          Chat with Cohere
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-auto space-y-4">
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={isTyping ? <TypingIndicator content="Cohere is typing..." /> : null}
                className="space-y-4 mt-4"
              >
                {messages.map((message, i) => (
                  <Message
                    key={i}
                    model={message}
                    className={`px-6 py-4 rounded-xl text-white max-w-[75%] `}
                    style={{
                      marginLeft: message.sender === 'user' ? 'auto' : 'initial',
                      marginRight: message.sender === 'Cohere' ? '550px' : 'initial',
                      borderRadius: '16px',
                    }}
                  />
                ))}
              </MessageList>
            </ChatContainer>
          </MainContainer>
        </div>

        {/* Message Input Box */}
        <div className="bg-gray-100 p-4">
          <MessageInput 
            placeholder="Type your message..." 
            onSend={handleSend} 
            className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

// const cohere = new CohereClientV2({
//   token: 'YOUR_COHERE_API_KEY', // Replace with your API key
// });

// function App() {
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I'm Cohere! Ask me anything!",
//       sentTime: "just now",
//       sender: "Cohere",
//     }
//   ]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [inputText, setInputText] = useState(""); // For MessageInput text
//   const [attachedfile, setAttachedFile] = useState(null); // For file attachments

//   // Handle sending messages
//   const handleSend = async () => {
//     if (!inputText.trim() && !attachedfile) return;

//     const newMessages = [...messages];

//     // Include attached file in the outgoing message if present
//     if (attachedfile) {
//       newMessages.push({
//         message: `Sent a file: ${attachedfile.name}`,
//         direction: 'outgoing',
//         sender: 'user',
//       });
//     }

//     // Include text in the outgoing message if present
//     if (inputText.trim()) {
//       newMessages.push({
//         message: inputText,
//         direction: 'outgoing',
//         sender: 'user',
//       });
//     }

//     setMessages(newMessages);
//     setIsTyping(true);
//     setInputText("");
//     setAttachedFile(null);

//     // Send prompt to Cohere
//     const prompt = `${attachedfile ? `User sent a file: ${attachedfile.name}\n` : ''}${inputText}`;
//     await processPromptToCohere(newMessages, prompt);
//   };

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setAttachedFile(file);
//       setInputText(`Selected file: ${file.name}`);
//     }
//   };

//   async function processPromptToCohere(chatMessages, prompt) {
//     try {
//       const response = await cohere.chat({
//         model: 'command-r-plus-08-2024',
//         messages: [{ role: 'user', content: prompt }],
//       });

//       if (response && response.message && Array.isArray(response.message.content) && response.message.content.length > 0) {
//         const reply = response.message.content[0].text;

//         setMessages([...chatMessages, {
//           message: reply,
//           sender: 'Cohere',
//         }]);
//       } else {
//         console.error('Invalid response structure:', response);
//       }
//     } catch (error) {
//       console.error('Error fetching from Cohere:', error);
//     } finally {
//       setIsTyping(false);
//     }
//   }

//   return (
//     <div className="h-screen w-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
//       <div className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-4 text-white text-2xl font-semibold rounded-t-3xl flex items-center justify-between">
//           <span>Chat with Cohere</span>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 p-6 overflow-auto space-y-4">
//           <MainContainer>
//             <ChatContainer>
//               <MessageList
//                 scrollBehavior="smooth"
//                 typingIndicator={isTyping ? <TypingIndicator content="Cohere is typing..." /> : null}
//                 className="space-y-4 mt-4"
//               >
//                 {messages.map((message, i) => (
//                   <Message
//                     key={i}
//                     model={message}
//                     className={`px-6 py-4 rounded-xl text-white max-w-[75%] `}
//                     style={{
//                       marginLeft: message.sender === 'user' ? 'auto' : 'initial',
//                       marginRight: message.sender === 'Cohere' ? '550px' : 'initial',
//                       borderRadius: '16px',
//                     }}
//                   />
//                 ))}
//               </MessageList>
//             </ChatContainer>
//           </MainContainer>
//         </div>

//         {/* Message Input Box */}
//         <div className="bg-gray-100 p-4 flex items-center">
//           <label className="cursor-pointer mr-3 text-blue-500 hover:text-blue-700">
//             <FaPaperclip size={24} />
//             <input
//               type="file"
//               accept="image/*,video/*,.pdf"
//               className="hidden"
//               onChange={handleFileUpload}
//             />
//           </label>
//           <MessageInput
//             placeholder="Type your message..."
//             onSend={handleSend}
//             attachFile={true}
//             value={inputText}
//             onChange={setInputText}
//             className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;