"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Wallet, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount } from 'wagmi';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';



const PaymentPage = ({ params }: { params: { id: string } }) => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    };



  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const Wallets= useAccount();
  const isWalletConnected = Wallets.isConnected  
   const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const projectId = params.id
  




  
  const handlePayment = () => {
    setLoading(true);
    console.log('Payment initiated for project:', projectId);
    console.log(auth.currentUser.uid)
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen relative top-[3.5rem] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-red-500">Fund The Innovation</h1>
          <p className="text-neutral-600">Support groundbreaking research and innovation projects on Avalanche</p>
        </div>

        {/* Main Payment Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter amount to fund in AVAX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.01"
                />

              </div>
            </div>

            {/* Token Selection */}
            <div className="space-y-2">
              <Label>Select Token</Label>
              <Select defaultValue="avax">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avax">AVAX</SelectItem>
                  <SelectItem value="usdc">USDC.e</SelectItem>
                  <SelectItem value="usdt">USDT.e</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wallet Connection Status */}
            {!isWalletConnected && (
              <Alert className="">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="mt-1">
                  Connect your wallet to the Avalanche C-Chain to proceed
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {!isWalletConnected && (
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                onClick={() => {}}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
            
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handlePayment}
              disabled={!amount || loading || !isWalletConnected}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Transaction Information */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[0.9rem]">
            <div className="flex justify-between">
              <span className="text-slate-600">Gas Fee (Est.)</span>
              <span>0.001 AVAX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Network</span>
              <span>Avalanche C-Chain</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Current AVAX Price</span>
              <span>$35.24 USD</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
