"use client";

import { useState, useEffect, use, useRef } from "react";
import {
  Star, ChevronLeft, ChevronRight, ChevronDown,
  CornerUpLeft, Forward, Edit3, MessageCircle,
  Video, Plus, PlusCircle, X, Check, Loader2, FileText,
  List, Link2, Image as ImageIcon, Paperclip,
  BookOpen, MessageSquarePlus, Wand2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTicketStore } from "../../store/ticketStore";
import { useRouter } from "next/navigation";

export default function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: ticketId } = use(params);
  const { tickets, updateTicket, addReply } = useTicketStore();

  const ticket = tickets.find(t => t.id === ticketId);

  // Estado local para los controles de formulario
  const [properties, setProperties] = useState({
    priority: "Alta",
    status: "Abierto",
    source: "Portal",
    type: "Incidente",
    group: "Activos de Software"
  });

  // Estado para el editor de respuestas
  const [replyMode, setReplyMode] = useState<'reply' | 'forward' | 'note' | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isPublicNote, setIsPublicNote] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  // Nuevos estados para herramientas inferiores
  const [showKBModal, setShowKBModal] = useState(false);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalInput, setModalInput] = useState("");
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedRange) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setReplyText(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
    setShowFontMenu(false);
  };

  const openModal = (type: 'link' | 'image' | 'font') => {
    saveSelection();
    if (type === 'link') {
      setShowImageModal(false);
      setShowFontMenu(false);
      setShowLinkModal(!showLinkModal);
      setModalInput("");
    } else if (type === 'image') {
      setShowLinkModal(false);
      setShowFontMenu(false);
      setShowImageModal(!showImageModal);
      setModalInput("");
    } else if (type === 'font') {
      setShowLinkModal(false);
      setShowImageModal(false);
      setShowFontMenu(!showFontMenu);
    }
  };

  const submitModal = (type: 'link' | 'image') => {
    restoreSelection();
    if (modalInput) {
      handleFormat(type === 'link' ? 'createLink' : 'insertImage', modalInput);
    }
    setShowLinkModal(false);
    setShowImageModal(false);
    setModalInput("");
  };

  // Funciones para herramientas inferiores
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const insertKBArticle = (title: string, url: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, `<a href="${url}" style="color: #2563eb; text-decoration: underline;">Artículo: ${title}</a>&nbsp;`);
      setReplyText(editorRef.current.innerHTML);
    }
    setShowKBModal(false);
  };

  const insertCannedResponse = (text: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, text.replace(/\n/g, '<br/>') + '<br/>');
      setReplyText(editorRef.current.innerHTML);
    }
    setShowCannedResponses(false);
  };
  const handleAIEnhance = async () => {
    if (!replyText.trim()) {
      toast.error("Escribe algo de texto primero para que la IA lo mejore.");
      return;
    }

    setIsAILoading(true);
    const loadingToast = toast.loading("La IA está mejorando tu redacción...");

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: replyText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No hay API Key configurada en el servidor (.env.local)");
        }
        throw new Error(data.error || 'Error desconocido');
      }

      if (editorRef.current && data.text) {
        editorRef.current.innerHTML = data.text;
        setReplyText(editorRef.current.innerHTML);
      }
      toast.dismiss(loadingToast);
      toast.success("Texto mejorado por Gemini");
    } catch (error: any) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Error al mejorar texto. Verifica tu conexión o configuración.");
    } finally {
      setIsAILoading(false);
    }
  };

  // Al cargar, inicializar con los datos del store
  useEffect(() => {
    if (ticket) {
      setProperties({
        priority: ticket.priority,
        status: ticket.status,
        source: ticket.source,
        type: ticket.type === 'incident' ? 'Incidente' : 'Solicitud',
        group: ticket.group
      });
    }
  }, [ticket]);

  if (!ticket) {
    return <div className="p-8 text-center text-gray-500">Ticket no encontrado</div>;
  }

  const handleUpdate = () => {
    // Actualizar el estado global
    updateTicket(ticketId, {
      priority: properties.priority,
      status: properties.status,
      source: properties.source,
      type: properties.type === 'Incidente' ? 'incident' : 'request',
      group: properties.group
    });

    toast.success("Propiedades del ticket actualizadas correctamente");
  };

  const handleSendReply = () => {
    const actionName = replyMode === 'reply' ? 'Respuesta enviada' : replyMode === 'forward' ? 'Ticket reenviado' : isPublicNote ? 'Nota pública añadida' : 'Nota interna añadida';

    // Añadir al store global
    addReply(ticketId, {
      id: `r_${Date.now()}`,
      author: "Soporte TI",
      authorInitials: "TI",
      date: "justo ahora",
      content: replyText,
      isInternal: replyMode === 'note' && !isPublicNote,
      to: replyMode !== 'note' ? ticket.requester : undefined
    });

    toast.success(`${actionName} correctamente`);
    setReplyMode(null);
    setReplyText("");
    setIsPublicNote(false);
    setAttachments([]);
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex items-center text-sm">
          <Link href="/tickets" className="text-blue-600 hover:underline">Tickets</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-600 font-medium">#{ticketId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <button className="p-2 border border-gray-100 rounded text-gray-400 hover:text-yellow-500 hover:bg-gray-50 transition-colors">
            <Star size={16} />
          </button>
          <button className="px-3 py-1.5 border border-gray-100 rounded text-gray-700 hover:bg-gray-50 transition-colors">
            Cerrar
          </button>
          <div className="flex">
            <button
              onClick={() => {
                setReplyMode('reply');
                document.getElementById('reply-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 border border-gray-100 border-r-0 rounded-l text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              Responder <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
          <button className="px-3 py-1.5 border border-gray-100 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 hidden sm:flex">
            Asociar <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button className="px-3 py-1.5 border border-gray-100 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 hidden sm:flex">
            Más <ChevronDown size={14} className="text-gray-400" />
          </button>

          <div className="flex ml-2">
            <button className="p-1.5 border border-gray-100 border-r-0 rounded-l text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 border border-gray-100 rounded-r text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-start">

          {/* Main Left Column */}
          <div className="flex-1 w-full space-y-4">

            {/* Original Request Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    ZW
                  </div>
                  <div className="flex-1">
                    <h1 className="text-[22px] font-semibold text-gray-900 leading-tight">{ticket.title}</h1>
                    <p className="text-sm text-gray-500 mt-1.5">
                      <span className="text-blue-600 font-medium cursor-pointer hover:underline">{ticket.requester}</span> reportó hace 2 días vía {ticket.source}
                    </p>
                  </div>
                </div>

                <div className="text-[14px] text-gray-700 leading-relaxed mb-8 ml-14">
                  Hola equipo,<br /><br />
                  Estoy intentando exportar un proyecto grande en Adobe Illustrator pero sigo recibiendo el "Error 42 P42" justo antes de que termine el renderizado. Ya he intentado reiniciar el equipo y vaciar la caché pero el problema persiste. ¿Podrían ayudarme con esto? Tengo una entrega importante mañana.<br /><br />
                  Gracias.
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 ml-14">
                  <button className="px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors uppercase tracking-wider">Tickets Hijo</button>
                  <button className="px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors uppercase tracking-wider">Tareas</button>
                  <button className="px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors uppercase tracking-wider">Activos</button>
                  <button className="px-4 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors uppercase tracking-wider">Actividades</button>
                </div>
              </div>
            </div>

            {/* Dynamic Replies */}
            {ticket.replies?.map((reply) => (
              <div key={reply.id} className={`border rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 mb-4 ${reply.isInternal ? 'bg-amber-50/30 border-amber-100' : 'bg-white border-gray-100'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${reply.isInternal ? 'bg-amber-100 text-amber-600' : 'bg-orange-100 text-orange-600'}`}>
                    {reply.authorInitials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-500 mb-4">
                        <span className="text-blue-600 font-medium cursor-pointer hover:underline">{reply.author}</span> {reply.isInternal ? 'añadió una nota' : 'respondió'} {reply.date}
                        {reply.to && (
                          <>
                            <br />
                            <span className="text-[11px] text-gray-400">Para: {reply.to}</span>
                          </>
                        )}
                      </p>
                      {reply.isInternal && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Nota Interna</span>
                      )}
                    </div>

                    <div
                      className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: reply.content }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Editor & Bottom Action Bar */}
            <div id="reply-section">
              {replyMode === null ? (
                <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-3 flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mr-2">
                    CR
                  </div>
                  <button onClick={() => setReplyMode('reply')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    <CornerUpLeft size={16} className="text-gray-400" /> Responder
                  </button>
                  <button onClick={() => setReplyMode('forward')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    <Forward size={16} className="text-gray-400" /> Reenviar
                  </button>
                  <button onClick={() => setReplyMode('note')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    <Edit3 size={16} className="text-gray-400" /> Nota interna
                  </button>
                </div>
              ) : (
                <div className={`bg-white border ${replyMode === 'note' ? 'border-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]' : 'border-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]'} rounded-xl shadow-sm flex flex-col transition-all overflow-hidden mt-4`}>

                  {/* Header Email-like fields */}
                  <div className="bg-gray-50/50 border-b border-gray-100 px-5 py-3 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 w-10 font-medium">De:</span>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2.5 py-1 shadow-sm cursor-pointer hover:bg-gray-50">
                          <span className="text-gray-800 font-medium">Soporte TI &lt;soporte@empresa.com&gt;</span>
                          <ChevronDown size={14} className="text-gray-400 ml-1" />
                        </div>
                      </div>
                      {replyMode === 'note' && (
                        <label className="flex items-center gap-2 text-xs font-semibold text-amber-700 cursor-pointer select-none bg-amber-50 px-2.5 py-1.5 rounded border border-amber-200 shadow-sm transition-colors hover:bg-amber-100">
                          <input
                            type="checkbox"
                            checked={isPublicNote}
                            onChange={(e) => setIsPublicNote(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          Visible para el solicitante
                        </label>
                      )}
                    </div>

                    {replyMode !== 'note' && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 w-10 font-medium">Para:</span>
                        <div className="flex items-center gap-1 bg-white border border-blue-200 rounded px-2.5 py-1 shadow-sm">
                          <span className="text-blue-600 font-medium">{ticket.requester.toLowerCase().replace(' ', '.')}@empresa.com</span>
                          <button className="text-gray-400 hover:text-gray-600 ml-1">×</button>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 ml-2 text-[11px] uppercase font-bold tracking-wider px-2 py-1 rounded hover:bg-gray-100 transition-colors">Cc / Bcc</button>
                      </div>
                    )}
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-1.5 bg-white relative">
                    <button onClick={() => handleFormat('bold')} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded font-serif font-bold w-8 h-8 flex items-center justify-center transition-colors">B</button>
                    <button onClick={() => handleFormat('italic')} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded font-serif italic w-8 h-8 flex items-center justify-center transition-colors">I</button>
                    <button onClick={() => handleFormat('underline')} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded font-serif underline w-8 h-8 flex items-center justify-center transition-colors">U</button>
                    <div className="w-px h-5 bg-gray-200 mx-1"></div>

                    <div className="relative">
                      <button onClick={() => openModal('font')} className={`p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1 text-[13px] font-medium px-2 h-8 transition-colors ${showFontMenu ? 'bg-gray-100' : ''}`}>
                        Fuente <ChevronDown size={14} />
                      </button>
                      {showFontMenu && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map((font) => (
                            <button
                              key={font}
                              onClick={() => { restoreSelection(); handleFormat('fontName', font); }}
                              className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-50 text-gray-700 transition-colors"
                              style={{ fontFamily: font }}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-px h-5 bg-gray-200 mx-1"></div>
                    <button onClick={() => handleFormat('insertUnorderedList')} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded w-8 h-8 flex items-center justify-center transition-colors"><List size={16} /></button>

                    <div className="relative">
                      <button onClick={() => openModal('link')} className={`p-1.5 text-gray-600 hover:bg-gray-100 rounded w-8 h-8 flex items-center justify-center transition-colors ${showLinkModal ? 'bg-gray-100' : ''}`}><Link2 size={16} /></button>
                      {showLinkModal && (
                        <div className="absolute top-full left-[-80px] mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Insertar Enlace</p>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={modalInput}
                              onChange={(e) => setModalInput(e.target.value)}
                              placeholder="https://..."
                              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                              onKeyDown={(e) => e.key === 'Enter' && submitModal('link')}
                              autoFocus
                            />
                            <button onClick={() => submitModal('link')} className="bg-blue-600 text-white rounded px-2 hover:bg-blue-700 transition-colors">
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button onClick={() => openModal('image')} className={`p-1.5 text-gray-600 hover:bg-gray-100 rounded w-8 h-8 flex items-center justify-center transition-colors ${showImageModal ? 'bg-gray-100' : ''}`}><ImageIcon size={16} /></button>
                      {showImageModal && (
                        <div className="absolute top-full left-[-120px] mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3">
                          <p className="text-xs font-semibold text-gray-600 mb-2">URL de Imagen</p>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={modalInput}
                              onChange={(e) => setModalInput(e.target.value)}
                              placeholder="https://.../foto.jpg"
                              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
                              onKeyDown={(e) => e.key === 'Enter' && submitModal('image')}
                              autoFocus
                            />
                            <button onClick={() => submitModal('image')} className="bg-blue-600 text-white rounded px-2 hover:bg-blue-700 transition-colors">
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => setReplyText(e.currentTarget.innerHTML)}
                    data-placeholder={
                      replyMode === 'note' ? "Escribe una nota interna para tu equipo aquí. Puedes mencionar a otros usando @..." :
                        replyMode === 'forward' ? "Escribe el mensaje de reenvío aquí..." :
                          `Hola ${ticket.requester.split(' ')[0]},\n\nEscribe tu respuesta aquí...`
                    }
                    className={`w-full min-h-[160px] p-5 text-[14px] text-gray-800 outline-none resize-y leading-relaxed overflow-y-auto
                      ${replyMode === 'note' ? 'bg-[#fffdf7]' : 'bg-white'} 
                      empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:whitespace-pre-wrap prose prose-sm max-w-none`}
                  />

                  {/* Attachments Display */}
                  {attachments.length > 0 && (
                    <div className="px-5 pb-3 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
                      {attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-[13px] text-gray-700">
                          <FileText size={14} className="text-gray-400" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 ml-1">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 px-5 py-3.5 bg-gray-50/50 gap-4 relative">

                    {/* Left Bottom Tools */}
                    <div className="flex items-center gap-1 text-gray-500">

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                      />
                      <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors relative" title="Adjuntar archivo">
                        <Paperclip size={18} />
                        {attachments.length > 0 && (
                          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </button>

                      <div className="relative">
                        <button onClick={() => { setShowKBModal(!showKBModal); setShowCannedResponses(false) }} className={`p-2 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors ${showKBModal ? 'bg-gray-200 text-gray-800' : ''}`} title="Base de conocimiento">
                          <BookOpen size={18} />
                        </button>
                        {showKBModal && (
                          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-100 p-3">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base de Conocimiento</p>
                            </div>
                            <div className="p-2 flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                              <button onClick={() => insertKBArticle("Solución a Error 42", "https://kb.empresa.com/error-42")} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                                📖 Solución a Error 42 en Adobe
                              </button>
                              <button onClick={() => insertKBArticle("Limpieza de caché general", "https://kb.empresa.com/cache")} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                                📖 Limpieza de caché general
                              </button>
                              <button onClick={() => insertKBArticle("Políticas de RAM", "https://kb.empresa.com/ram")} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
                                📖 Ajustes y Políticas de RAM
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button onClick={() => { setShowCannedResponses(!showCannedResponses); setShowKBModal(false) }} className={`p-2 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors ${showCannedResponses ? 'bg-gray-200 text-gray-800' : ''}`} title="Respuestas predefinidas">
                          <MessageSquarePlus size={18} />
                        </button>
                        {showCannedResponses && (
                          <div className="absolute bottom-full left-[-40px] mb-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-100 p-3">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Respuestas Rápidas</p>
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                              <button onClick={() => insertCannedResponse("Hola,\n\nHemos recibido tu solicitud y la estamos revisando. Te contactaremos pronto.")} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors truncate">
                                💬 Saludo Inicial Estándar
                              </button>
                              <button onClick={() => insertCannedResponse("Hemos solucionado el inconveniente reportado. Por favor, verifica de tu lado y confirma si podemos proceder al cierre del ticket.")} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors truncate">
                                💬 Solicitud de Validación
                              </button>
                              <button onClick={() => insertCannedResponse("Como no hemos recibido respuesta en los últimos 3 días, procederemos a cerrar este ticket. Si el problema persiste, puedes reabrirlo o crear uno nuevo.")} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors truncate">
                                💬 Cierre por inactividad
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <button
                        onClick={handleAIEnhance}
                        disabled={isAILoading}
                        className={`px-3 py-1.5 border rounded-lg transition-colors flex items-center gap-1.5
                          ${isAILoading
                            ? 'bg-purple-100 text-purple-400 border-purple-200 cursor-not-allowed'
                            : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
                          }`}
                        title="Mejorar con IA"
                      >
                        {isAILoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                        <span className="text-[13px] font-semibold hidden sm:inline tracking-wide">
                          {isAILoading ? 'Mejorando...' : 'Mejorar (IA)'}
                        </span>
                      </button>
                    </div>

                    {/* Right Bottom Actions */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider hidden sm:inline mr-2">
                        {replyText.length > 0 ? "Borrador guardado" : ""}
                      </span>
                      <button
                        onClick={() => { setReplyMode(null); setReplyText(""); setIsPublicNote(false); }}
                        className="px-4 py-2 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                      >
                        Cancelar
                      </button>

                      <div className="flex shadow-sm rounded-lg">
                        <button
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                          className={`px-5 py-2 text-[13px] font-semibold text-white border-r border-white/20 rounded-l-lg transition-all
                            ${!replyText.trim() ? 'opacity-50 cursor-not-allowed bg-blue-400' :
                              replyMode === 'note' ? 'bg-[#d97706] hover:bg-amber-700' : 'bg-[#0f172a] hover:bg-gray-800'
                            }`}
                        >
                          {replyMode === 'note' ? 'Añadir Nota' : 'Enviar'}
                        </button>
                        <button
                          disabled={!replyText.trim()}
                          className={`px-2.5 py-2 text-white rounded-r-lg transition-all flex items-center justify-center
                            ${!replyText.trim() ? 'opacity-50 cursor-not-allowed bg-blue-400' :
                              replyMode === 'note' ? 'bg-[#d97706] hover:bg-amber-700' : 'bg-[#0f172a] hover:bg-gray-800'
                            }`}
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-4">

            {/* Quick Status */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Estado</p>
                  <p className="text-sm font-semibold text-gray-900">{ticket.status}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Prioridad</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${ticket.priority === 'Alta' ? 'bg-red-500' : ticket.priority === 'Media' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <p className="text-sm font-semibold text-gray-900">{ticket.priority}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Vencimiento SLA</p>
                <p className="text-sm font-semibold text-gray-900">Hoy a las 5:00 PM</p>
                <p className="text-xs text-red-500 font-medium">En 2 horas</p>
              </div>
            </div>

            {/* Requester Info */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <ChevronDown size={14} /> INFO DEL SOLICITANTE
                </h3>
                <button className="text-blue-500 hover:text-blue-700"><PlusCircle size={14} /></button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    ZW
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">{ticket.requester}</h4>
                    <p className="text-[11px] text-gray-500">Diseñador Gráfico</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Correo</p>
                  <p className="text-sm text-gray-900">{ticket.requester.toLowerCase().replace(' ', '.')}@empresa.com</p>
                </div>
                <button className="text-xs text-blue-600 hover:underline mb-4 font-medium">Ver 3 tickets recientes</button>
              </div>
            </div>

            {/* Properties */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <ChevronDown size={14} /> PROPIEDADES
                </h3>
                <button
                  onClick={handleUpdate}
                  className="bg-white border border-gray-200 text-gray-700 text-[11px] px-3 py-1 rounded font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm active:scale-95"
                >
                  Actualizar
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">Prioridad</label>
                    <select
                      value={properties.priority}
                      onChange={(e) => setProperties({ ...properties, priority: e.target.value })}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-gray-50 outline-none focus:border-blue-400 transition-colors"
                    >
                      <option>Baja</option>
                      <option>Media</option>
                      <option>Alta</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">Estado</label>
                    <select
                      value={properties.status}
                      onChange={(e) => setProperties({ ...properties, status: e.target.value })}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white outline-none focus:border-blue-400 transition-colors"
                    >
                      <option>Abierto</option>
                      <option>En curso</option>
                      <option>En espera</option>
                      <option>Cerrado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">Origen</label>
                    <select
                      value={properties.source}
                      onChange={(e) => setProperties({ ...properties, source: e.target.value })}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white outline-none focus:border-blue-400 transition-colors"
                    >
                      <option>Chat</option>
                      <option>Correo</option>
                      <option>Portal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">Tipo</label>
                    <select
                      value={properties.type}
                      onChange={(e) => setProperties({ ...properties, type: e.target.value })}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white outline-none focus:border-blue-400 transition-colors"
                    >
                      <option>Incidente</option>
                      <option>Solicitud</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[11px] text-gray-500 font-medium mb-1 block">Grupo Asignado</label>
                    <select
                      value={properties.group}
                      onChange={(e) => setProperties({ ...properties, group: e.target.value })}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white outline-none focus:border-blue-400 transition-colors"
                    >
                      <option>Activos de Software</option>
                      <option>Redes</option>
                      <option>Cuentas de Usuario</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
