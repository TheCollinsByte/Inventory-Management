"use client";
import { firestore } from "@/firebase";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    InputAdornment,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Fetches the initial inventory and updates on changes
    const updateInventory = async () => {
        const inventorySnapshot = query(collection(firestore, "inventory"));
        const inventoryDocs = await getDocs(inventorySnapshot);
        const inventoryDataList = [];
        inventoryDocs.forEach((doc) => {
            inventoryDataList.push({
                name: doc.id,
                ...doc.data(),
            });
        });
        setInventory(inventoryDataList);
    };

    // Adds an item to the inventory or increments its quantity
    const addItem = async (item) => {
        const formattedItem = item.charAt(0).toUpperCase() + item.slice(1);
        const inventorySnapshot = doc(
            collection(firestore, "inventory"),
            formattedItem
        );
        const inventoryDoc = await getDoc(inventorySnapshot);
        if (inventoryDoc.exists()) {
            await updateDoc(inventorySnapshot, {
                quantity: inventoryDoc.data().quantity + 1,
            });
        } else {
            await setDoc(inventorySnapshot, { quantity: 1 });
        }
        updateInventory();
    };

    // Removes an item from the inventory or decrements its quantity
    const removeItem = async (item) => {
        const inventorySnapshot = doc(collection(firestore, "inventory"), item);
        const inventoryDoc = await getDoc(inventorySnapshot);
        if (inventoryDoc.exists() && inventoryDoc.data().quantity > 1) {
            await updateDoc(inventorySnapshot, {
                quantity: inventoryDoc.data().quantity - 1,
            });
        } else {
            await deleteDoc(inventorySnapshot);
        }
        updateInventory();
    };

    // Updates the quantity of an existing item
    const updateItemQuantity = async (item, quantity) => {
        const formattedItem = item.charAt(0).toUpperCase() + item.slice(1);
        const inventorySnapshot = doc(
            collection(firestore, "inventory"),
            formattedItem
        );
        const inventoryDoc = await getDoc(inventorySnapshot);
        if (inventoryDoc.exists()) {
            await updateDoc(inventorySnapshot, { quantity: Number(quantity) });
        } else {
            await setDoc(inventorySnapshot, { quantity: Number(quantity) });
        }
        updateInventory();
    };

    useEffect(() => {
        updateInventory(); // Refresh the inventory when the component mounts
    }, []);

    // Modal handling functions
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Filtered list for search functionality
    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generateCSV = (inventoryData) => {
        const headers = "Item,Quantity\n";
        const rows = inventoryData
            .map(({ name, quantity }) => `${name},${quantity}`)
            .join("\n");
        return headers + rows;
    };

    const downloadCSV = () => {
        const csvContent = generateCSV(inventory);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "pantry_inventory.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                backgroundImage:
                    "linear-gradient(to right bottom, #E3F2FD, #BBDEFB, #90CAF9)",
                color: "#1565C0",
            }}
        >
            <Typography
                variant="h3"
                color="#1565C0"
                fontWeight="bold"
                p={5}
                sx={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                }}
            >
                Pantry Inventory System
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: { xs: "center", sm: "space-between" },
                    width: "100%",
                    maxWidth: { sm: "600px", md: "800px" },
                    marginBottom: "20px",
                    gap: { xs: "10px", sm: "20px" },
                }}
            >
                <TextField
                    label="Search Pantry"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                    sx={{
                        flex: 1,
                        marginRight: { sm: "20px" },
                        marginBottom: { xs: "20px", sm: "0" },
                        "& .MuiInputLabel-root": { color: "#1565C0" },
                        "& .MuiOutlinedInput-root": {
                            color: "#1565C0",
                            "& fieldset": { borderColor: "#1565C0" },
                            "&:hover fieldset": { borderColor: "#1565C0" },
                            "&.Mui-focused fieldset": { borderColor: "#1565C0" },
                        },
                        input: { color: "#1565C0" },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#1565C0" }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                        background: "linear-gradient(to top, #1E88E5, #64B5F6)",
                        color: "#fff",
                        fontWeight: "bold",
                        textShadow: "0px 0px 8px rgba(0,0,0,0.4)",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        "&:hover": {
                            background: "linear-gradient(to top, #1976D2, #42A5F5)",
                        },
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                        padding: { xs: "6px 10px", sm: "8px 15px", md: "10px 20px" },
                        whiteSpace: "nowrap",
                        minWidth: { xs: "100%", sm: "auto" },
                        marginTop: { xs: "10px", sm: "0" },
                    }}
                >
                    Add New Item(s)
                </Button>
                <Button
                    variant="contained"
                    onClick={downloadCSV}
                    sx={{
                        background: "linear-gradient(to top, #7C4DFF, #18FFFF)",
                        color: "#fff",
                        fontWeight: "bold",
                        textShadow: "0px 0px 8px rgba(0,0,0,0.8)",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                        "&:hover": {
                            background: "linear-gradient(to top, #651FFF, #00B8D4)",
                        },
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                        padding: { xs: "6px 10px", sm: "8px 15px", md: "10px 20px" },
                        whiteSpace: "nowrap",
                        minWidth: { xs: "100%", sm: "auto" },
                        marginTop: { xs: "10px", sm: "0" },
                    }}
                >
                    Download CSV
                </Button>
            </Box>
            <Modal open={open} onClose={handleClose} sx={{ overflow: "auto" }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90vw", sm: "50vw", md: "600px" },
                        bgcolor: "background.paper",
                        border: "2px solid #fff",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                        Update Item Quantity
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Enter item name..."
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            updateItemQuantity(item, quantity);
                            setItem("");
                            setQuantity(1);
                            handleClose();
                        }}
                        sx={{
                            background: "linear-gradient(to top, #7C4DFF, #18FFFF)",
                            color: "#fff",
                            fontWeight: "bold",
                            textShadow: "0px 0px 8px rgba(0,0,0,0.8)",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                                background: "linear-gradient(to top, #651FFF, #00B8D4)",
                            },
                        }}
                    >
                        Update
                    </Button>
                </Box>
            </Modal>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: { sm: "600px", md: "800px" },
                    maxHeight: "60vh",
                    overflow: "auto",
                    border: "2px solid black",
                    borderRadius: "8px",
                    p: 1,
                }}
            >
                {filteredInventory.map(({ name, quantity }) => (
                    <Box
                        key={name}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            m: 1,
                            bgcolor: "#FFFFFF",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                bgcolor: "#F5F5F5",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                cursor: "pointer",
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                flexGrow: 1,
                                color: "#333",
                                fontWeight: "bold",
                                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#333",
                                fontWeight: "bold",
                                minWidth: "50px",
                                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                            }}
                        >
                            {quantity}
                        </Typography>
                        <IconButton
                            color="success"
                            onClick={() => addItem(name)}
                            sx={{
                                mx: 1,
                                "& .MuiSvgIcon-root": {
                                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(124, 77, 255, 0.2)",
                                },
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => removeItem(name)}
                            sx={{
                                mx: 1,
                                "& .MuiSvgIcon-root": {
                                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(124, 77, 255, 0.2)",
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
