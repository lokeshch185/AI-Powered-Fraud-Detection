 export default function Chatbot() {
    return (
      <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold">SBI AI Assistant</h3>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {/* Chat Messages */}
          <div className="flex gap-2">
            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
              <p>Hello! How can I help you today?</p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <p>I need help with my claim status</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type your message..."
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }