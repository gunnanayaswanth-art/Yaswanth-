import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Wifi, Shield, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-neon-cyan font-mono relative overflow-hidden">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] animate-scanline bg-gradient-to-b from-white via-transparent to-white bg-[length:100%_4px]" />
      
      {/* Static Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.02] animate-static bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5a/Can_of_static.png')]" />

      {/* Main Container */}
      <div className="relative z-10 container mx-auto min-h-screen flex flex-col items-center justify-center p-4 md:p-8 gap-8">
        
        {/* Header Section */}
        <header className="w-full flex flex-col items-center mb-4">
          <div className="flex items-center gap-4 mb-2">
            <Cpu className="w-8 h-8 text-neon-magenta animate-pulse" />
            <div className="h-px w-24 bg-neon-magenta" />
            <Shield className="w-8 h-8 text-neon-yellow" />
          </div>
          
          <h1 
            className="text-4xl md:text-7xl font-display text-neon-magenta glitch-text mb-2" 
            data-text="NEON_SNAKE.SYS"
          >
            NEON_SNAKE.SYS
          </h1>
          
          <div className="flex gap-8 text-[10px] font-pixel tracking-widest text-neon-yellow uppercase">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> VOLTAGE: 240V</span>
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> LINK: ESTABLISHED</span>
            <span>OS: GLITCH_KERN_v4.0</span>
          </div>
        </header>

        {/* Content Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: System Status */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            <div className="border-2 border-neon-magenta p-4 bg-black/80 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-neon-magenta animate-scanline" />
              <h3 className="text-xs font-display text-neon-magenta mb-4">CORE_STATUS</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[8px]">
                      <span>NODE_0{i}</span>
                      <span>{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-900 border border-neon-cyan/30">
                      <motion.div 
                        animate={{ width: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-neon-cyan" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-neon-cyan p-4 bg-black/80">
              <h3 className="text-xs font-display text-neon-cyan mb-2">ENCRYPTION</h3>
              <p className="text-[8px] leading-relaxed break-all font-mono opacity-60">
                0x4A 0x72 0x69 0x66 0x74 0x65 0x72 0x20 0x4D 0x61 0x63 0x68 0x69 0x6E 0x65 0x20 0x41 0x63 0x74 0x69 0x76 0x61 0x74 0x65 0x64
              </p>
            </div>
          </aside>

          {/* Center Column: Game */}
          <main className="lg:col-span-6 flex flex-col items-center">
            <div className="relative p-1 bg-neon-magenta animate-tearing">
              <div className="bg-black border-4 border-neon-cyan p-2">
                <SnakeGame />
              </div>
            </div>
            
            <div className="mt-8 w-full border-t-2 border-dashed border-neon-yellow/30 pt-4 flex justify-between items-center">
              <div className="text-[10px] font-pixel text-neon-yellow animate-pulse">
                &gt; ACCESSING_DATA_STREAM...
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-neon-cyan animate-ping" />
                <div className="w-3 h-3 bg-neon-magenta animate-ping [animation-delay:0.2s]" />
                <div className="w-3 h-3 bg-neon-yellow animate-ping [animation-delay:0.4s]" />
              </div>
            </div>
          </main>

          {/* Right Column: Music */}
          <aside className="lg:col-span-3 flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-neon-magenta opacity-20 blur-sm group-hover:opacity-40 transition" />
              <MusicPlayer />
            </div>

            <div className="border-2 border-neon-yellow p-4 bg-black/80">
              <h3 className="text-xs font-display text-neon-yellow mb-4">COMMAND_LIST</h3>
              <div className="grid grid-cols-1 gap-2 text-[10px] font-pixel">
                <div className="flex justify-between border-b border-neon-yellow/20 pb-1">
                  <span>UP/DOWN</span>
                  <span className="text-neon-cyan">NAVIGATE</span>
                </div>
                <div className="flex justify-between border-b border-neon-yellow/20 pb-1">
                  <span>SPACE</span>
                  <span className="text-neon-magenta">HALT_PROC</span>
                </div>
                <div className="flex justify-between border-b border-neon-yellow/20 pb-1">
                  <span>ESC</span>
                  <span className="text-neon-yellow">ABORT</span>
                </div>
              </div>
            </div>
          </aside>

        </div>

        {/* Footer */}
        <footer className="w-full mt-auto pt-8 border-t border-neon-cyan/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[8px] font-mono opacity-40 uppercase tracking-[0.3em]">
            &copy; 2026 GLITCH_CORP // ALL_RIGHTS_RESERVED
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-1 bg-neon-magenta" />
            <div className="h-4 w-1 bg-neon-cyan" />
            <div className="h-4 w-1 bg-neon-yellow" />
          </div>
        </footer>
      </div>

      {/* Screen Tearing Overlay (Randomly appearing) */}
      <div className="fixed top-1/2 left-0 w-full h-px bg-neon-magenta z-[60] opacity-0 animate-tearing pointer-events-none shadow-[0_0_10px_#ff00ff]" />
    </div>
  );
}
