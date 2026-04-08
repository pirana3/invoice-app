import {Text, View, ActivityIndicator, Alert, Pressable, ScrollView, TextInput, Image } from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useEffect, useMemo, useState} from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths} from 'expo-file-system';
import { getBusinessInfo} from '@/database/businessinfodb';
import { createEstimate, getEstimateById, updateEstiamte } from '@/database/estimatecontent';
import { getProducts, type Product } from '@/database/productdb';
import {
    createEstimateItem,
    deleteEstimateItemsByEstimateId,
    getEstimateItemsByEstimateId,
} from '@/database/estimateitemsdb';


const estimateCreate = () => {
    const router = useRouter();
    const [clientname, setCleintname] = useState('');
    const [estimatenumber, setEstimatenumber] = useState('');
    const [estimatedate, setEstimatedate] = useState('');
    const [estiamteproducts, setEstimateproducts] = useState('');
    const [estiamtetotalamount, setEstimatetotalamount] = useState('');
    const [estiamntepercentage, setEstimatepercentage] = useState('');
    const [estiamtetax, setEstimatetax] = useState('');
    const [estiamtenotes, setEstiamtenotes] = useState('');
    const [estiamtetermsandconditions, setEstiamtetermsandconditions] = useState('');
    const [estiamtedetails, setEstiamtedetails] = useState('');

    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [centerLogo, setCenterLogo] = useState(false);
    const [pdfUri, setPdfUri] = useState<string | null>(null);
    const [isGenerating, SetIsGeneraating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isSavingInvoice, setIsSavingInvoice] = useState(false);
    const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<
        Record<
            number,
            {
                id: number;
                name: String;
                price: number;
                qty: String;
                unitPrice: String;
                manualPrice: String;
                useManual: boolean;
            }
        >
    >({});

    const params = useLocalSearchParams<{ id?: string }>();
    const invoiceId = params.id ? Number(params.id) : NaN;
    const isEditing = Number.isFinite(estimateId);

    useEffect(() => {
        const loadLogo = async () => {
            const buisnesses = await getBusinessInfo();
            const latest = buisnesses?.[0];
            setLogoUri(latest?.logo || null);
        };
        loadLogo();
    }, []);

    useEffect(() => {
        const loadEstimate = async () => {
            if (!isEditing) return;
            const estiamte = await getEstimateById(estiamteId);
            if (!estiamte) return;
            setCleintname(estiamte.clientname);
            setEstimatenumber(String(estiamte.estimatenumber));
            setEstimatedate(String(estiamte.estimatedate));
            setEstimateproducts(estiamte.estiamteproducts); 
            setEstimatetotalamount(String(estiamte.estiamtetotalamount));
            setEstimatepercentage(String(estiamte.estiamntepercentage));
            setEstimatetax(String(estiamte.estiamtetax));
            setEstiamtenotes(estiamte.estiamtenotes);
            setEstiamtetermsandconditions(estiamte.estiamtetermsandconditions);
            setEstiamtedetails(estiamte.estiamtedetails);
            const items = await getEstimateItemsByEstimateId(estiamteId);
            if(items.length > 0) {
                const mapped: Record<
                    number,
                    { id: number; name: String; price: number; qty: String; unitPrice: String; manualPrice: String; useManual: boolean }
                > = {};
                items.forEach((item) => {
                    const key = item.productId || item.id;
                    mapped[key] = {
                        id: key,
                        name: item.estimatename,
                        price: Number(item.unitPrice ?? 0),
                        qty: String(item.estimatequantity ?? 1),
                        unitPrice: String(item.unitPrice ?? 0),
                        manualAmount: String(item.manualAmount ?? 0),
                        useManual: item.estimateuseManual === 1,
                    },
                });
                setSelectedProducts(mapped);
            } else {
                try {
                    const parsed = JSON.parse(estimate.products);
                    if (Array.isArray(parsed)) {
                        const mapped: Record<
                            number,
                            { id: number; name: String; price: number; qty: String; unitPrice: String; manualPrice: String; useManual: boolean }
                        > = {};
                        parsed.forEach((item) => {
                            if (item?.id != null){
                                mapped[item.id] = {
                                    id: item.id,
                                    name: item.name ?? 'Item',
                                    price: Number(item.price ?? 0),
                                    qty: '1',
                                    unitPrice: String(item.amount ?? 0),
                                    manualAmount: String(item.amount ?? 0),
                                    useManual: false,
                                };
                            }
                        });
                        setSelectedProducts(mapped);
                    }
                } catch {}
            }
        };
        loadEstimate();
    }, [estimateId, isEditing]);

    useEffect(() => {
        const loadProducts = async () => {
            const items = await getProducts();
            setAllProducts(items);
        };
        if (isProductsModalOpen){
            loadProducts();
        }
    }, [isProductsModalOpen]);

    const subtotal = useMemo(() => {
        const selectTotal = Object.values(selectedProdcuts).reduce((sum, item) => {
            const selectedTotal = Object.values(selectedProducts).reduce((sum, item) => {
                const manual = Number(item.manualAmount);
                return Number.isFinite(manual) ? sum + manual : sum;
            }
            const qty = Number(item.qty);
            const unit = Number(item.unitPrice);
            if (!Number.isFinite(qty) || !Number.isFinite(unit)) return sum;
            return sum + qty * unit;
        }, 0);
        return selectTotal || Number(totalamount) || 0;
    }, [selectedProducts, totalamount]);
    const taxAm
    }
        }
    })

  return (
    <View>
      <Text>estimateCreate</Text>
    </View>
  )
}

export default estimateCreate
