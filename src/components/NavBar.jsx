import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import supabase from '../lib/supabaseClient';
import { clearUser } from '../slices/authSlice';
import logo from '../asset/logo.png';

const navigation = [
  { name: 'Come Lavoriamo', href: '/come-lavoriamo' },
  { name: 'Diventa Segnalatore', href: '/diventa-segnalatore' },
  { name: 'Blog Immobili', href: '/blog' },
  { name: 'Proprietà in Vendita', href: '/proprieta-vendita' },
];

const NavBar = ({ current = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Crea la lista di navigazione dinamica
  const getNavigationItems = () => {
    // Se siamo sulla homepage (current è vuoto), mostra tutti i link tranne Home
    if (!current) {
      return navigation;
    }
    
    // Se siamo su una pagina specifica, aggiungi Home come prima voce e rimuovi la pagina corrente
    const homeItem = { name: 'Home', href: '/' };
    const filteredNavigation = navigation.filter(item => item.name !== current);
    
    return [homeItem, ...filteredNavigation];
  };

  const navigationItems = getNavigationItems();

  const doLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate('/');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate('/');
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <NavLink to="/" className="-m-1.5 p-1.5 inline-flex items-center">
            <img alt="logo" src={logo} className="h-24 w-auto" />
          </NavLink>
        </div>

        <div className="flex lg:hidden">
          <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12 mx-auto">
          {navigationItems.map((item) => (
            <NavLink key={item.name} to={item.href} className={({ isActive }) => (isActive ? 'text-blue-600 font-semibold' : 'text-white')}>{item.name}</NavLink>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <button onClick={() => setLogoutOpen(true)} className="ml-4 text-white bg-red-600 px-3 py-1 rounded">Logout</button>
          ) : null}
        </div>

        {/* Mobile Menu Dialog */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <NavLink to="/" className="-m-1.5 p-1.5 inline-flex items-center">
                <img alt="logo" src={logo} className="h-24 w-auto" />
              </NavLink>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-200">
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigationItems.map((item) => (
                    <NavLink key={item.name} to={item.href} className="block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5">
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="py-6">
                  {user ? (
                    <button onClick={handleLogout} className="block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5">Logout</button>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      {/* Logout confirmation dialog */}
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <Dialog.Panel className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
          <Dialog.Title className="text-lg font-semibold">Conferma logout</Dialog.Title>
          <div className="mt-4 text-sm text-gray-600">Vuoi davvero effettuare il logout?</div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setLogoutOpen(false)} className="px-3 py-2 border rounded">Annulla</button>
            <button onClick={async () => { setLogoutOpen(false); await doLogout(); }} className="px-3 py-2 bg-red-600 text-white rounded">Esci</button>
          </div>
        </Dialog.Panel>
      </Dialog>
      </nav>
    </header>
  );
};

export default NavBar;

