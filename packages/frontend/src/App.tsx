import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BlockList } from './pages/BlockList';
import { BlockDetail } from './pages/BlockDetail';
import { TransactionDetail } from './pages/TransactionDetail';
import { CellDetail } from './pages/CellDetail';
import { Activities } from './pages/Activities';
import { Inventory } from './pages/Inventory';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BlockList />} />
        <Route path="/blocks/:number" element={<BlockDetail />} />
        <Route path="/tx/:hash" element={<TransactionDetail />} />
        <Route path="/cell/:txHash/:index" element={<CellDetail />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
