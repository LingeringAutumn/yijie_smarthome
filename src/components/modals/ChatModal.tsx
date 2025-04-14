// ChatModal.tsx
import React, { useState, useContext, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from '../ui/button';

// 假设 DevicePage 的状态和函数可以通过上下文传递
const DeviceContext = React.createContext({
	devices: {},
	setDevices: (devices: { [key: string]: boolean }) => { }, // 确保这里接受一个参数
	isTVModalOpen: false,
	setIsTVModalOpen: (value: boolean) => { },
	isFridgeModalOpen: false,
	setIsFridgeModalOpen: (value: boolean) => { },
	isLightModalOpen: false,
	setIsLightModalOpen: (value: boolean) => { },
	isThermostatModalOpen: false,
	setIsThermostatModalOpen: (value: boolean) => { },
	isSpeakerModalOpen: false,
	setIsSpeakerModalOpen: (value: boolean) => { },
	isSmartLockModalOpen: false,
	setIsSmartLockModalOpen: (value: boolean) => { },
	isCurtainModalOpen: false,
	setIsCurtainModalOpen: (value: boolean) => { },
	isHeatingModalOpen: false,
	setIsHeatingModalOpen: (value: boolean) => { },
	isFanModalOpen: false,
	setIsFanModalOpen: (value: boolean) => { },
	isRiceCookerModalOpen: false,
	setIsRiceCookerModalOpen: (value: boolean) => { },
	isWaterHeaterModalOpen: false,
	setIsWaterHeaterModalOpen: (value: boolean) => { }
});

interface ChatModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	// 预设的回复映射
	const presetResponses = {
		// "无聊": "如果您感到无聊，可以去观看有趣的电视",
		"无聊": "结合您的使用习惯，为您智能推荐智能音箱与电视",
		"好热": "识别到现在是夏季的夜晚，建议您打开空调",
		"睡觉": "结合您的使用习惯，建议您关闭房间的灯与窗帘，并播放柔和的轻音乐",
		"做什么呢？":"我是您的智能家居助手！能根据您的需求智能推荐家居组件，并结合您的个人习惯与所处环境自动预测您的需求！",
		"回来": "基于您的使用习惯，鉴于您总是在回家后立刻洗澡，建议您现在就打开热水器"
	};

	const [tvModalClosed, setTvModalClosed] = useState(false);
	const [sleepModalSequence, setSleepModalSequence] = useState(0); // 0: 未开始, 1: 灯光, 2: 窗帘, 3: 音响
	const [messages, setMessages] = useState([
		{ text: "请问有什么可以帮您？", isUser: false }
	]);
	const [inputValue, setInputValue] = useState('');

	const {
		setIsTVModalOpen,
		setIsFridgeModalOpen,
		setIsLightModalOpen,
		setIsThermostatModalOpen,
		setIsSpeakerModalOpen,
		setIsSmartLockModalOpen,
		setIsCurtainModalOpen,
		setIsHeatingModalOpen,
		setIsFanModalOpen,
		setIsRiceCookerModalOpen,
		setIsWaterHeaterModalOpen,
		isTVModalOpen,
		isLightModalOpen,
		isCurtainModalOpen
	} = useContext(DeviceContext);

	// 监听电视机控件状态变化
	useEffect(() => {
		if (tvModalClosed && !isTVModalOpen) {
			setTimeout(() => {
				setIsSpeakerModalOpen(true);
				setTvModalClosed(false);
			}, 300);
		}
	}, [isTVModalOpen, tvModalClosed, setIsSpeakerModalOpen]);

	// 监听睡眠模式下的控件状态变化
	useEffect(() => {
		if (sleepModalSequence === 1 && !isLightModalOpen) {
			setTimeout(() => {
				setIsCurtainModalOpen(true);
				setSleepModalSequence(2);
			}, 300);
		} else if (sleepModalSequence === 2 && !isCurtainModalOpen) {
			setTimeout(() => {
				setIsSpeakerModalOpen(true);
				setSleepModalSequence(0);
			}, 300);
		}
	}, [isLightModalOpen, isCurtainModalOpen, sleepModalSequence, setIsCurtainModalOpen, setIsSpeakerModalOpen]);

	const handleSend = () => {
		if (inputValue.trim() === '') return;
		setMessages([...messages, { text: inputValue, isUser: true }]);
		setInputValue('');
		
		setTimeout(() => {
			let response = "好的，请稍候";
			
			for (const [keyword, presetResponse] of Object.entries(presetResponses)) {
				if (inputValue.includes(keyword)) {
					response = presetResponse;
					if (response.includes("智能音箱与电视")) {
						setTimeout(() => {
							setIsTVModalOpen(true);
							setTvModalClosed(true);
						}, 300);
						break;
					} else if (response.includes("冰箱")) {
						setTimeout(() => {
							setIsFridgeModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("灯与窗帘")) {
						setTimeout(() => {
							setIsLightModalOpen(true);
							setSleepModalSequence(1);
						}, 300);
						break;
					} else if (response.includes("空调")) {
						setTimeout(() => {
							setIsThermostatModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("智能音响")) {
						setTimeout(() => {
							setIsSpeakerModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("门锁")) {
						setTimeout(() => {
							setIsSmartLockModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("窗帘")) {
						setTimeout(() => {
							setIsCurtainModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("地暖")) {
						setTimeout(() => {
							setIsHeatingModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("电风扇")) {
						setTimeout(() => {
							setIsFanModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("电饭煲")) {
						setTimeout(() => {
							setIsRiceCookerModalOpen(true);
						}, 300);
						break;
					} else if (response.includes("热水器")) {
						setTimeout(() => {
							setIsWaterHeaterModalOpen(true);
						}, 300);
						break;
					}
					break;
				}
			}
			
			setMessages(prev => [...prev, { text: response, isUser: false }]);
		}, 700);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSend();
		}
	};

	return (
		<div id="chatModal" className="fixed top-0 right-0 h-screen bg-[#E0EBE0] shadow-xl p-6 w-[480px] z-50 transition-all duration-300 transform translate-x-0 flex flex-col">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-medium">AI 助手</h3>
				<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
					<i className="fas fa-times"></i>
				</button>
			</div>
			<ScrollArea className="flex-1 pr-4 overflow-y-auto">
				<div className="space-y-4">
					{messages.map((message, index) => (
						<div key={index} className={`flex ${message.isUser ? 'justify-end' : ''}`}>
							<div
								className={`rounded-lg p-3 shadow-sm ${message.isUser ? 'bg-[#2D5A27] text-white' : 'bg-white text-[#1F2973]'}`
								}>
								<p>{message.text}</p>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
			<div className="border-t border-gray-200 pt-4">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<input
							type="text"
							placeholder="输入消息..."
							className="w-full h-[44px] pl-10 pr-4 rounded-lg bg-white border-none text-sm"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<i className="fas fa-keyboard absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
					</div>
					<Button className="bg-[#2D5A27] hover:bg-[#1F4A1F] !rounded-button h-[44px] w-[44px]" onClick={handleSend}>
						<i className="fas fa-paper-plane"></i>
					</Button>
					<Button className="bg-[#2D5A27] hover:bg-[#1F4A1F] !rounded-button h-[44px] w-[44px]">
						<i className="fas fa-microphone"></i>
					</Button>
				</div>
			</div>
		</div>
	);
};

export { ChatModal, DeviceContext };