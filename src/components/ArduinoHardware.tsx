import React, { useRef, useState } from 'react';
import { Cpu, Usb, Zap, PowerOff } from 'lucide-react';
import { POINTS_3D, type Point3D } from '../data/acupoints';
import { Muscular3DViewer } from './Muscular3DViewer';

interface ArduinoHardwareProps {
  pins: Record<number, boolean>;
  onTogglePin: (pin: number, nextVal?: boolean) => void;
  onAllOff: () => void;
  serialLogs: { dir: 'tx' | 'rx'; text: string }[];
  onAddLog: (dir: 'tx' | 'rx', text: string) => void;
  selectedPoint: Point3D;
  onSelectPoint: (p: Point3D) => void;
}

const ARDUINO_INO = `// Veda AI – LED acupoint controller (Arduino Uno)
// Protocol (9600 baud): "LED:<pin>:<0|1>\\n"  and  "ALL:0\\n"
String line;
void setup() {
  Serial.begin(9600);
  for (int i = 2; i <= 13; i++) {
    pinMode(i, OUTPUT);
    digitalWrite(i, LOW);
  }
  Serial.println("Veda ready v1.0");
}
void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\\n') {
      if (line.startsWith("LED:")) {
        int a = line.indexOf(':', 4);
        int pin = line.substring(4, a).toInt();
        int v = line.substring(a + 1).toInt();
        digitalWrite(pin, v ? HIGH : LOW);
        Serial.println("OK " + line);
      } else if (line.startsWith("ALL:")) {
        for (int i = 2; i <= 13; i++) digitalWrite(i, LOW);
        Serial.println("OK ALL");
      }
      line = "";
    } else if (c != '\\r') {
      line += c;
    }
  }
}`;

const PYTHON_BRIDGE = `# Optional PC bridge: pip install pyserial
import serial, time
ser = serial.Serial("COM3", 9600, timeout=1)   # change COM port
time.sleep(2)
def led(pin, on):
    ser.write(f"LED:{pin}:{1 if on else 0}\\n".encode())
    print(ser.readline().decode().strip())
for pin in range(2, 14):
    led(pin, 1); time.sleep(0.2); led(pin, 0)`;

export const ArduinoHardware: React.FC<ArduinoHardwareProps> = ({
  pins,
  onTogglePin,
  onAllOff,
  serialLogs,
  onAddLog,
  selectedPoint,
  onSelectPoint,
}) => {
  const [hwTab, setHwTab] = useState<'model' | 'serial' | 'ino' | 'python'>('model');
  const [connectedLabel, setConnectedLabel] = useState('Not connected');
  const [isConnected, setIsConnected] = useState(false);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);

  const sendSerial = async (cmd: string) => {
    onAddLog('tx', cmd);
    if (writerRef.current) {
      try {
        await writerRef.current.write(new TextEncoder().encode(cmd + '\n'));
      } catch {
        // Ignore serial stream drop
      }
    } else {
      onAddLog('rx', 'OK ' + cmd);
    }
  };

  const connectVirtual = () => {
    writerRef.current = null;
    setIsConnected(true);
    setConnectedLabel('Virtual Arduino Uno R3 (simulation) · 9600 baud');
    onAddLog('rx', 'Veda ready v1.0');
  };

  const connectUsb = async () => {
    const nav = navigator as Navigator & {
      serial?: { requestPort: () => Promise<{ open: (opts: { baudRate: number }) => Promise<void>; writable: WritableStream<Uint8Array> | null }> };
    };
    if (!nav.serial) {
      onAddLog('rx', 'Web Serial USB requires Chrome or Edge on desktop.');
      return;
    }
    try {
      const port = await nav.serial.requestPort();
      await port.open({ baudRate: 9600 });
      if (port.writable) {
        writerRef.current = port.writable.getWriter();
      }
      setIsConnected(true);
      setConnectedLabel('USB Serial Connected · 9600 baud');
      onAddLog('rx', 'Port opened at 9600 baud');
    } catch {
      onAddLog('rx', 'USB connection cancelled');
    }
  };

  const handlePinTap = (pin: number) => {
    const next = !pins[pin];
    onTogglePin(pin, next);
    sendSerial(`LED:${pin}:${next ? 1 : 0}`);
    const pt = POINTS_3D.find((p) => p.pin === pin);
    if (pt && next) onSelectPoint(pt);
  };

  const runSweep = async () => {
    for (let pin = 2; pin <= 13; pin++) {
      onTogglePin(pin, true);
      await sendSerial(`LED:${pin}:1`);
      await new Promise((r) => setTimeout(r, 150));
      onTogglePin(pin, false);
      await sendSerial(`LED:${pin}:0`);
    }
  };

  const activePinPointIds = POINTS_3D.filter((p) => p.pin && pins[p.pin]).map((p) => p.id);

  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-300" />
          Physical Arduino Computing
        </h2>
        <div className="flex flex-wrap gap-1 bg-black/30 p-1 rounded-xl">
          {[
            ['model', 'Hardware & 3D Model'],
            ['serial', 'Serial Monitor'],
            ['ino', 'Arduino .ino'],
            ['python', 'Python Bridge'],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setHwTab(k as typeof hwTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                hwTab === k ? 'bg-sky-500 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-black/30 border border-white/10 p-3">
        <span className={`text-xs font-semibold ${isConnected ? 'text-emerald-300' : 'text-slate-300'}`}>
          {connectedLabel}
        </span>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button type="button" onClick={connectVirtual} className="veda-btn veda-btn-green text-xs py-1.5 px-3">
            Virtual Uno
          </button>
          <button type="button" onClick={connectUsb} className="veda-btn veda-btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
            <Usb className="w-3.5 h-3.5" /> USB Serial
          </button>
          <button type="button" onClick={runSweep} className="veda-btn text-xs py-1.5 px-3 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Test LED Sweep
          </button>
          <button
            type="button"
            onClick={() => {
              onAllOff();
              sendSerial('ALL:0');
            }}
            className="veda-btn text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <PowerOff className="w-3.5 h-3.5" /> All Off
          </button>
        </div>
      </div>

      {hwTab === 'model' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div>
            <div className="text-xs text-slate-300 mb-2">Digital pins D2–D13 (tap to toggle physical LED &amp; 3D point)</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, idx) => {
                const pin = idx + 2;
                const pt = POINTS_3D.find((p) => p.pin === pin);
                const on = Boolean(pins[pin]);
                return (
                  <button
                    key={pin}
                    type="button"
                    onClick={() => handlePinTap(pin)}
                    style={
                      on
                        ? {
                            background: `radial-gradient(circle at 50% 30%, #ffffff, ${pt?.c || '#5ac8fa'} 65%)`,
                            color: '#031226',
                            boxShadow: `0 0 18px ${pt?.c || '#5ac8fa'}`,
                          }
                        : undefined
                    }
                    className={`h-14 rounded-xl border text-xs font-semibold transition-all ${
                      on
                        ? 'border-white'
                        : 'border-white/20 bg-white/10 text-slate-100 hover:bg-white/20'
                    }`}
                  >
                    <div>D{pin}</div>
                    <div className="text-[11px] opacity-85">{pt ? pt.id : '—'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Muscular3DViewer
            region="body"
            selectedPoint={selectedPoint}
            onSelectPoint={onSelectPoint}
            problemPointIds={activePinPointIds.length > 0 ? activePinPointIds : null}
            showAllPointsOverride={activePinPointIds.length === 0}
            heightClass="h-[380px]"
            compact
          />
        </div>
      )}

      {hwTab === 'serial' && (
        <div className="h-72 overflow-y-auto rounded-xl bg-black/45 border border-white/10 p-3 font-mono text-xs space-y-1">
          {serialLogs.length === 0 ? (
            <div className="text-slate-400">No serial traffic yet. Connect Virtual Uno or toggle a pin.</div>
          ) : (
            serialLogs.map((l, idx) => (
              <div key={idx} className={l.dir === 'tx' ? 'text-sky-300' : 'text-emerald-300'}>
                {l.dir === 'tx' ? '→ ' : '← '}
                {l.text}
              </div>
            ))
          )}
        </div>
      )}

      {hwTab === 'ino' && (
        <pre className="rounded-xl bg-black/45 border border-white/10 p-4 font-mono text-xs overflow-x-auto max-h-96 text-slate-100">
          {ARDUINO_INO}
        </pre>
      )}

      {hwTab === 'python' && (
        <pre className="rounded-xl bg-black/45 border border-white/10 p-4 font-mono text-xs overflow-x-auto max-h-96 text-slate-100">
          {PYTHON_BRIDGE}
        </pre>
      )}
    </div>
  );
};
