import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { 
  Menu, X, Phone, Mail, MapPin, ChevronRight, 
  Plane, Ship, Truck, Warehouse, ArrowRight, 
  CheckCircle, Clock, Package, Search, Globe,
  Shield, Zap, BarChart3, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import './App.css'
 
// Tracking data type
 interface TrackingEvent { 
 date: string
 time: string
 location: string
 status: string
 completed: boolean 
}
interface TrackingData {
  trackingNumber: string
  origin: string
  destination: string
  estimatedDelivery: string
  status: string
  events: TrackingEvent[]
}
const sampleTrackingData: Record<string, TrackingData> = {
  'ITR78738957': {
  trackingNumber: 'ITR78738957',
  origin: 'Glasgow Airport, United Kingdom',
  destination: 'Wrocław, Poland',
  estimatedDelivery: 'June 12, 2026',
  status: 'Arrived at Destination Airport - Pending Customs Clearance',
  events: [
    { date: 'Jun 12', time: '02:15 AM', location: 'Wrocław, Poland', status: 'Out for delivery to the final recipient', completed: false },
    { date: 'Jun 12', time: '11:15 AM', location: 'Wrocław, Poland', status: 'held in customs awaiting clearance fee payment', completed: false },
    { date: 'Jun 12', time: '09:20 AM', location: 'Wrocław, Poland', status: 'Arrived at destination airport cargo terminal', completed: true },
    { date: 'Jun 11', time: '05:45 PM', location: 'In transit (Airborne)', status: 'Flight departed from United Kingdom', completed: true },
    { date: 'Jun 11', time: '03:30 PM', location: 'Glasgow Airport, United Kingdom', status: 'Loaded onto international flight', completed: true },
    { date: 'Jun 10', time: '04:20 PM', location: 'Glasgow Airport, United Kingdom', status: 'Export customs clearance completed', completed: true },
    { date: 'Jun 10', time: '11:10 AM', location: 'Glasgow Airport, United Kingdom', status: 'Processed at origin cargo facility', completed: true },
    { date: 'Jun 09', time: '02:30 PM', location: 'Glasgow Airport, United Kingdom', status: 'Shipment registered', completed: true },
    { date: 'Jun 09', time: '03:15 PM', location: 'Glasgow Airport, United Kingdom', status: 'Airway bill issued', completed: true },
    { date: 'Jun 09', time: '04:00 PM', location: 'Glasgow Airport, United Kingdom', status: 'Cargo received by carrier', completed: true }
  ]
 },

  'ITR78738981': {
  trackingNumber: 'ITR78738981',
  origin: 'Halle, Saxony, Germany',
  destination: 'Grünwald, Germany',
  estimatedDelivery: 'July 10, 2026',
  status: 'in transit',
  events: [
    { date: 'July 9', time: '08:00 AM', location: 'Schkeuditz, Germany', status: 'Shipment information received', completed: true },
    { date: 'July 9', time: '02:30 PM', location: 'Halle, Saxony, Germany', status: 'Package accepted and processed at origin facility', completed: true },
    { date: 'July 9', time: '04:00 PM', location: 'Schkeuditz, Germany', status: 'In transit to destination', completed: true },
    { date: 'July 10', time: '06:30 AM', location: 'Grünwald, Germany', status: 'Arrived at destination facility', completed: true  },
    { date: 'July 10', time: '08:15 AM', location: 'Grünwald, Germany', status: 'Held in customs awaiting clearance fee payment', completed: false },
    { date: 'July 10', time: '10:00 AM', location: 'Grünwald, Germany', status: 'Out for delivery', completed: false }
  ]
 },
    
  'ITR78738964': {
  trackingNumber: 'ITR78738964',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Sibiu, Romania',
  estimatedDelivery: 'May 21, 2026',
  status: 'in transit',
  events: [
    { date: 'May 18', time: '09:00 AM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Shipment information received', completed: true },
    { date: 'May 19', time: '10:15 AM', location: 'Tel Aviv (TLV), Israel', status: 'Package accepted and processed at origin facility', completed: true },
    { date: 'May 20', time: '12:40 PM', location: 'Paris, France', status: 'In transit to destination country', completed: true },
    { date: 'May 21', time: '03:10 PM', location: 'Sibiu, Romania', status: 'Held in customs awaiting clearance fee payment', completed: false }
  ] 
 },

  'ITR78738953': {
  trackingNumber: 'ITR78738953',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Paris, France',
  estimatedDelivery: 'May 18, 2026',
  status: 'Processed',
  events: [
    { date: 'May 16', time: '09:00 AM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment information received', completed: true },
    { date: 'May 16', time: '12:30 PM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment processed at origin facility', completed: true },
    { date: 'May 17', time: '08:00 AM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Scheduled departure from origin facility', completed: true },
    { date: 'May 17', time: '02:45 PM', location: 'In Transit', status: 'In transit to destination country', completed: true },
    { date: 'May 18', time: '10:15 AM', location: 'Paris, France', status: 'Arrival at destination facility', completed: true },
    { date: 'May 18', time: '—', location: 'Paris, France', status: 'Held in customs awaiting clearance fee payment', completed: false }
   ]
  },

  'ITR78738977': {
  trackingNumber: 'ITR78738977',
  origin: 'Ben Gurion International Airport (TLV), Israel',
  destination: 'Posadas, Misiones, Argentina',
  estimatedDelivery: 'December 16, 2025',
  status: 'processed',
  events: [
    { date: 'December 13, 2025', time: '09:00 AM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Shipment information received', completed: true },
    { date: 'December 13, 2025', time: '10:15 AM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Package accepted and processed at origin facility', completed: true },
    { date: 'December 14, 2025', time: '12:40 PM', location: 'In transit', status: 'In transit to destination country', completed: true },
    { date: 'December 16, 2025', time: '03:10 PM', location: 'Posadas, Misiones, Argentina', status: 'Arrived at destination facility', completed: true },
  ]
 },

  'ITR78738971': {
  trackingNumber: '78738971',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Amărăștii de Jos, Dolj, Romania',
  estimatedDelivery: 'July 24, 2026',
  status: 'Processed',
  events: [
    { date: 'July 21', time: '07:51 AM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment registered and processed', completed: true },
    { date: 'July 21', time: '08:30 AM', location: 'Ben Gurion International Airport (TLV)', status: 'Airway bill issued and verified', completed: true },
    { date: 'July 21', time: '03:00 PM', location: 'In transit', status: 'General cargo departed from origin facility', completed: true },
    { date: 'July 22', time: '11:20 AM', location: 'In transit', status: 'Shipment in transit to destination', completed: true },
    { date: 'July 24', time: '08:00 AM', location: 'Destination facility', status: 'Arrived at destination facility', completed: true },
    { date: 'July 24', time: '09:00 AM', location: 'Destination facility', status: 'Held in customs awaiting clearance fee payment', completed: false },
    { date: 'July 24', time: '10:00 AM', location: 'Amărăștii de Jos, Dolj, Romania', status: 'Out for delivery', completed: false },
  ]
},
    
  'ITR78738955': {
  trackingNumber: '78738955',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Mexicali, BC, Mexico',
  estimatedDelivery: 'July 11, 2026',
  status: 'Processed',
  events: [
    { date: 'July 8', time: '09:00 AM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment registered and processed', completed: true },
    { date: 'July 8', time: '02:30 PM', location: 'Ben Gurion International Airport (TLV)', status: 'Airway bill issued and verified', completed: true },
    { date: 'July 9', time: '12:45 AM', location: 'In transit', status: 'General cargo departed from origin facility', completed: true },
    { date: 'July 10', time: '11:20 AM', location: 'In transit', status: 'Shipment in transit to destination', completed: true },
    { date: 'July 11', time: '08:20 AM', location: 'Destination facility', status: 'Arrived at destination facility', completed: true },
    { date: 'July 11', time: '10:15 AM', location: 'Mexicali, BC, Mexico', status: 'Held in customs awaiting clearance fee payment', completed: false },
    { date: 'July 11', time: '12:15 PM', location: 'Mexicali, BC, Mexico', status: 'Out for delivery', completed: false },
  ]
 },
  
'ITR78738952': {
  trackingNumber: '78738952',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Texas, USA',
  estimatedDelivery: 'May 18, 2026',
  status: 'Processed',
  events: [
    { date: 'May 14', time: '09:00 AM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment registered and processed', completed: true },
    { date: 'May 14', time: '02:30 PM', location: 'Ben Gurion International Airport (TLV)', status: 'Airway bill issued and verified', completed: true },
    { date: 'May 15', time: '11:45 AM', location: 'In transit', status: 'General cargo departed from origin facility', completed: true },
    { date: 'May 16', time: '08:20 PM', location: 'In transit', status: 'Shipment in transit to destination', completed: true },
    { date: 'May 18', time: '10:15 AM', location: 'Texas, USA', status: 'Held in customs awaiting clearance fee payment', completed: false }
  ]
 },

'ITR78738961': {
  trackingNumber: 'ITR78738961', 
  origin: 'Ben Gurion International Airport (TLV), Israel',
  destination: 'Wyndham Vale, Victoria 3024, Australia',
  estimatedDelivery: 'July 9, 2026',
  status: 'Shipment In Transit',
  events: [
    { date: 'Jul 9', time: '08:30 AM', location: 'Wyndham Vale, Victoria, Australia', status: 'Out for delivery', completed: false },
    { date: 'Jul 9', time: '06:30 AM', location: 'Melbourne, Victoria, Australia', status: 'Awating custom clearance fee', completed: false },
    { date: 'Jul 8', time: '05:40 PM', location: 'Melbourne, Victoria, Australia', status: 'Customs inspection in progress', completed: true },
    { date: 'Jul 9', time: '06:30 AM', location: 'Melbourne, Victoria, Australia', status: 'Arrived at local delivery facility', completed: true },
    { date: 'Jul 8', time: '11:20 AM', location: 'Melbourne Airport, Australia', status: 'Arrived in destination country', completed: true },
    { date: 'Jul 7', time: '09:45 PM', location: 'In transit (Airborne)', status: 'Flight departed transit hub', completed: true },
    { date: 'Jul 7', time: '03:30 PM', location: 'Singapore', status: 'Shipment transferred at transit hub', completed: true },
    { date: 'Jul 7', time: '10:15 AM', location: 'In transit (Airborne)', status: 'Flight departed from origin country', completed: true },
    { date: 'Jul 6', time: '04:50 PM', location: 'Ben Gurion (TLV), Israel', status: 'Export customs clearance completed', completed: true },
    { date: 'Jul 6', time: '02:15 PM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Processed at origin facility', completed: true },
    { date: 'Jul 6', time: '09:00 AM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Shipment registered', completed: true }
  ]
},

  'ITR90125677': {
  trackingNumber: 'ITR90125677',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Oklahoma, United States',
  estimatedDelivery: 'July 25, 2026',
  status: 'Processed',
  events: [
    { date: 'July 22', time: '08:15 AM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment information received', completed: true },
    { date: 'July 22', time: '10:42 AM', location: 'Tel Aviv (TLV), Israel', status: 'Shipment processed at origin facility', completed: true },
    { date: 'July 22', time: '03:20 PM', location: 'Ben Gurion International Airport (TLV), Israel', status: 'Scheduled departure from origin facility', completed: true },
    { date: 'July 22', time: '06:00 PM', location: 'In Transit', status: 'In transit to destination country', completed: true },
    { date: 'July 23', time: '02:30 PM', location: 'John F. Kennedy International Airport (JFK), New York, United States', status: 'Arrival at intermediate transit facility', completed: true },
    { date: 'July 23', time: '04:45 PM', location: 'John F. Kennedy International Airport (JFK), New York, United States', status: 'Customs clearance processing', completed: false },
    { date: 'July 23', time: '05:20 PM', location: 'John F. Kennedy International Airport (JFK), New York, United States', status: 'Departed from intermediate facility', completed: false },
    { date: 'July 24', time: '06:15 AM', location: 'Dallas/Fort Worth International Airport (DFW), Texas, United States', status: 'Arrival at regional sorting facility', completed: false },
    { date: 'July 24', time: '09:30 AM', location: 'Dallas/Fort Worth International Airport (DFW), Texas, United States', status: 'Departed from regional sorting facility', completed: false },
    { date: 'July 25', time: '07:00 AM', location: 'Oklahoma City, Oklahoma, United States', status: 'Arrival at destination facility', completed: false },
    { date: 'July 25', time: '02:00 PM', location: 'Miami, Oklahoma 75354, United States', status: 'Delivered — Signed by: A. Duley', completed: false }
  ]
},
    
  'ITR78738962': {
  trackingNumber: 'ITR78738962',
  origin: 'Dubai International Airport (DXB), Dubai, United Arab Emirates',
  destination: 'Aylesbury, Buckinghamshire HP20 2GN, United Kingdom',
  estimatedDelivery: 'July 7, 2026',
  status: 'Shipment In Transit', 
  events: [
    { date: 'Jul 7', time: '02:30 PM', location: 'Aylesbury, Buckinghamshire, UK', status: 'Held in customs awaiting clearance fees before final delivery', completed: false },
    { date: 'Jul 7', time: '09:30 AM', location: 'Aylesbury, Buckinghamshire, UK', status: 'Arrived at local delivery facility', completed: true },
    { date: 'Jul 6', time: '05:40 PM', location: 'London, UK', status: 'Customs clearance in progress', completed: true },
    { date: 'Jul 6', time: '02:15 PM', location: 'Dubai International Airport (DXB), UAE', status: 'Departed origin facility', completed: true },
    { date: 'Jul 6', time: '09:00 AM', location: 'Dubai International Airport (DXB), UAE', status: 'Shipment registered', completed: true }
  ]
},

  'ITR78738951': {
  trackingNumber: 'ITR78738951',
  origin: 'Tel Aviv (TLV), Israel',
  destination: 'Pogoanele, Buzău County, Romania',
  estimatedDelivery: 'June 26, 2026',
  status: 'Shipment In Transit',
  events: [
    { date: 'Jun 26', time: '08:30 AM', location: 'Pogoanele, Romania', status: 'Out for delivery', completed: false },
    { date: 'Jun 26', time: '06:30 PM', location: 'Bucharest, Romania', status: 'Held in Customs Awaiting Clearance Fee', completed: false },
    { date: 'Jun 26', time: '07:15 AM', location: 'Bucharest, Romania', status: 'Arrived at local delivery facility', completed: true },
    { date: 'Jun 25', time: '05:40 PM', location: 'Bucharest, Romania', status: 'Customs clearance in progress', completed: true },
    { date: 'Jun 25', time: '11:20 AM', location: 'Bucharest Henri Coanda Airport, Romania', status: 'Arrived in destination country', completed: true },
    { date: 'Jun 24', time: '09:45 PM', location: 'In transit (Airborne)', status: 'Flight departed transit hub', completed: true },
    { date: 'Jun 24', time: '03:30 PM', location: 'Athens, Greece', status: 'Shipment transferred at transit hub', completed: true },
    { date: 'Jun 24', time: '10:15 AM', location: 'In transit (Airborne)', status: 'Flight departed from origin country', completed: true },
    { date: 'Jun 23', time: '04:50 PM', location: 'Ben Gurion (TLV), Israel', status: 'Export customs clearance completed', completed: true },
    { date: 'Jun 23', time: '02:15 PM', location: 'Tel Aviv, Israel', status: 'Processed at origin facility', completed: true },
    { date: 'Jun 23', time: '09:00 AM', location: 'Tel Aviv, Israel', status: 'Shipment registered', completed: true }
  ]
} 
};

function App() {

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    emailjs.sendForm(
  'service_vm89se5',
  'template_5a5aqca',
  e.currentTarget,
  'xrCyEx9urDpKKAyGw'
)
.then(() => {
  alert('Message sent successfully!');
})
.catch((error) => {
  console.log(error);
  alert('Failed to send message.');
});
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState<any>(null)
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', message: '' })
  
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTrack = () => {
  // Check empty input
  if (!trackingNumber.trim()) {
    toast.error('Please enter a tracking number')
    return
  }

  // Convert to uppercase
  const upperTracking = trackingNumber.toUpperCase()

  // Check if tracking exists
  const data = (sampleTrackingData as any)[upperTracking]

  if (data) {
    setTrackingData(data)
    setIsTrackingDialogOpen(true)
    return
  }

  // Not found
  toast.error('Tracking code not found')
}

  

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const services = [
    {
      icon: Plane,
      title: 'Air Freight',
      description: 'Time-critical shipments delivered with precision. Our air freight services ensure your goods reach their destination quickly and safely.',
      image: '/service-air.jpg'
    },
    {
      icon: Ship,
      title: 'Ocean Freight',
      description: 'Cost-effective global shipping solutions. We handle FCL and LCL shipments to and from major ports worldwide.',
      image: '/service-ocean.jpg'
    },
    {
      icon: Truck,
      title: 'Road Transport',
      description: 'Seamless inland connectivity with our extensive fleet of trucks and trailers for domestic and cross-border transportation.',
      image: '/service-road.jpg'
    },
    {
      icon: Warehouse,
      title: 'Warehousing',
      description: 'Secure storage and inventory management solutions with real-time tracking and distribution services.',
      image: '/service-warehouse.jpg'
    }
  ]

  const stats = [
    { value: '25+', label: 'Years Experience', icon: Clock },
    { value: '150+', label: 'Countries Served', icon: Globe },
    { value: '50K+', label: 'Deliveries Monthly', icon: Package },
    { value: '99%', label: 'On-Time Delivery', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className={`font-display text-xl lg:text-2xl font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>
                itr<span className="text-primary">ans</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { label: 'Home', ref: heroRef },
                { label: 'About', ref: aboutRef },
                { label: 'Services', ref: servicesRef },
                { label: 'Quote', ref: quoteRef },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.ref)}
                  className={`font-body text-sm font-medium hover:text-primary transition-colors ${
                    isScrolled ? 'text-text-dark' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Contact Info */}
            <div className="hidden lg:flex items-center gap-6">
              <a 
                href="mailto:info@itranslo.itranslogisticsltd.com" 
                className={`flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ${
                  isScrolled ? 'text-text-dark' : 'text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>info@itranslo.itranslogisticsltd.com</span>
              </a>
              <Button 
                onClick={() => scrollToSection(quoteRef)}
                className="bg-primary hover:bg-primary-600 text-white"
              >
                Get a Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <nav className="flex flex-col p-4 gap-4">
              {[
                { label: 'Home', ref: heroRef },
                { label: 'About', ref: aboutRef },
                { label: 'Services', ref: servicesRef },
                { label: 'Quote', ref: quoteRef },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.ref)}
                  className="text-left text-text-dark font-medium py-2 hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a 
                href="mailto:info@itranslo.itranslogisticsltd.com" 
                className="flex items-center gap-2 text-text-dark text-sm py-2"
              >
                <Mail className="w-4 h-4" />
                info@itranslo.itranslogisticsltd.com
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-ship.jpg" 
            alt="Container ship" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-white text-sm font-medium">Global Logistics Solutions</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Logistics & Supply Chain Solutions
            </h1>
            
            <p className="text-white/90 text-lg sm:text-xl max-w-2xl mb-8 font-body">
              We are the leading logistics provider, ensuring your goods move seamlessly across the globe. From air freight to ocean shipping, we've got you covered.
            </p>

            {/* Tracking Input */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 max-w-2xl">
              <label className="text-white text-sm font-medium mb-3 block">
                Track Your Shipment
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., ITR123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="w-full pl-12 pr-4 py-6 bg-white border-0 text-text-dark placeholder:text-text-light rounded-xl"
                  />
                </div>
                <Button 
                  onClick={handleTrack}
                  className="bg-primary hover:bg-primary-600 text-white px-8 py-6 rounded-xl font-medium"
                >
                  Track
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <p className="text-white/60 text-xs mt-3">
                Try sample tracking numbers: ITR123456789 or ITR987654321
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="font-display text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <span className="text-white/70 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 lg:py-32 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img 
                  src="/about-equipment.jpg" 
                  alt="Logistics equipment" 
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl hidden lg:block">
                <div className="font-display text-4xl font-bold">25+</div>
                <div className="text-white/80 text-sm">Years of Excellence</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4">
                <div className="w-8 h-[2px] bg-primary" />
                About Us
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
                Your Trusted Logistics Partner
              </h2>
              
              <p className="text-text-dark text-lg leading-relaxed mb-6">
                With over two decades of experience, iTrans Logistics has revolutionized the way businesses handle their supply chains. We combine cutting-edge technology with robust infrastructure to deliver unparalleled service.
              </p>
              
              <p className="text-text-light leading-relaxed mb-8">
                Our global network spans 150+ countries, enabling us to provide seamless logistics solutions tailored to your unique needs. From small businesses to enterprise corporations, we handle every shipment with the same level of care and professionalism.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, text: 'Secure Transportation' },
                  { icon: BarChart3, text: 'Real-time Tracking' },
                  { icon: Users, text: '24/7 Customer Support' },
                  { icon: Globe, text: 'Global Coverage' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-text-dark font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => scrollToSection(quoteRef)}
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                More About Us
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 lg:py-32 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4">
              <div className="w-8 h-[2px] bg-primary" />
              Our Services
              <div className="w-8 h-[2px] bg-primary" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
              Comprehensive Logistics Solutions
            </h2>
            <p className="text-text-light text-lg">
              We offer a full range of logistics services to meet your transportation and supply chain needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="service-card bg-white rounded-2xl overflow-hidden shadow-card group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="service-image w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <button className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section ref={quoteRef} className="py-20 lg:py-32 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4">
                <div className="w-8 h-[2px] bg-primary" />
                Request a Quote
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
                Get Your Free Quote Today
              </h2>
              
              <p className="text-text-light text-lg mb-12">
                Fill out the form and our team will get back to you within 24 hours with a customized quote for your logistics needs.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: 'Phone', value: '+1 (806) 671-0011' },
                  { icon: Mail, label: 'Email', value: 'info@itranslo.itranslogisticsltd.com' },
                  { icon: MapPin, label: 'Address', value: '123 Logistics Way, Houston, TX 77001' },
                ].map((contact: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <contact.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-text-light text-sm mb-1">
                        {contact.label}
                      </div>
                      <div className="text-text-dark font-medium">
                        {contact.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
                <form onSubmit={sendEmail} className="space-y-6">
                  <div>
                    <label className="block text-text-dark font-medium mb-2">Full Name *</label>
                    <Input
                      name="user_name"
                      type="text"
                      placeholder="John Doe"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-dark font-medium mb-2">Email *</label>
                      <Input
                        name="user_email"
                        type="email"
                        placeholder="john@example.com"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-text-dark font-medium mb-2">Phone</label>
                      <Input
                        name="user_phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-dark font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Tell us about your logistics needs..."
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-600 text-white py-6 rounded-xl font-medium"
                  >
                    Submit Request
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-2xl font-bold">
                  itr<span className="text-primary">ans</span>
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Your trusted partner for global logistics and supply chain solutions. Delivering excellence since 1999.
              </p>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <span className="text-xs font-medium">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-3">
                {['Air Freight', 'Ocean Freight', 'Road Transport', 'Warehousing', 'Supply Chain'].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-white/60 hover:text-primary transition-colors text-sm">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'News', 'Partners', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-primary transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-display font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Track Shipment', 'FAQs', 'Terms of Service', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-primary transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2024 iTrans Logistics Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Shipment Tracking</DialogTitle>
          </DialogHeader>
          
          {trackingData && (
            <div className="mt-4">
              {/* Tracking Header */}
              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-text-light text-sm mb-1">Tracking Number</div>
                    <div className="font-display text-lg font-bold text-black">{trackingData.trackingNumber}</div>
                  </div>
                  <div>
                    <div className="text-text-light text-sm mb-1">Status</div>
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="font-medium text-primary">{trackingData.status}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-text-light text-sm mb-1">From</div>
                    <div className="font-medium text-text-dark">{trackingData.origin}</div>
                  </div>
                  <div>
                    <div className="text-text-light text-sm mb-1">To</div>
                    <div className="font-medium text-text-dark">{trackingData.destination}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-text-light text-sm mb-1">Estimated Delivery</div>
                    <div className="font-display text-lg font-bold text-primary">{trackingData.estimatedDelivery}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="tracking-timeline space-y-6">
                {trackingData.events.map((event: TrackingEvent, index: number) => (
                  <div key={index} className={`tracking-timeline-item ${event.completed ? 'completed' : ''}`}>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-display font-bold text-black">{event.date}</span>
                        <span className="text-text-light">•</span>
                        <span className="text-text-light">{event.time}</span>
                      </div>
                      <div className="text-text-dark font-medium">{event.status}</div>
                      <div className="text-text-light text-sm">{event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
