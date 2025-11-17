import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LineraDemo() {
  const [counterValue, setCounterValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [clientStatus, setClientStatus] = useState(lineraClient.getStatus());
  const { toast } = useToast();

  useEffect(() => {
    // Initialize connection and fetch initial state
    const initializeClient = async () => {
      setIsLoading(true);
      await lineraClient.connect();
      await refreshCounter();
      setClientStatus(lineraClient.getStatus());
      setIsLoading(false);
    };

    initializeClient();
  }, []);

  const refreshCounter = async () => {
    try {
      const state = await lineraClient.queryState();
      if (state) {
        setCounterValue(state.counter);
      }
    } catch (error) {
      console.error('Failed to refresh counter:', error);
    }
  };

  const executeOperation = async (operation: 'increment' | 'decrement' | 'reset') => {
    setIsLoading(true);
    
    try {
      let op;
      switch (operation) {
        case 'increment':
          op = { Increment: { value: 1 } };
          break;
        case 'decrement':
          op = { Decrement: { value: 1 } };
          break;
        case 'reset':
          op = { Reset: {} };
          break;
      }

      const receiptId = await lineraClient.executeOperation(op);
      
      if (receiptId) {
        toast({
          title: "Operation Successful",
          description: `Receipt: ${receiptId.slice(0, 16)}...`,
        });
        
        // Refresh counter state after successful operation
        setTimeout(() => {
          refreshCounter();
        }, 500);
      } else {
        throw new Error('Operation returned no receipt');
      }
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setClientStatus(lineraClient.getStatus());
    }
  };

  const ConnectionStatus = () => {
    if (clientStatus.isConnected) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      );
    } else if (clientStatus.lastError) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Connecting
        </Badge>
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Conway Testnet Demo
          </h1>
          <p className="text-muted-foreground">
            Live Linera microchain interaction • Write→Read cycle test
          </p>
        </div>

        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Connection Status
              <ConnectionStatus />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Chain ID</p>
                <p className="font-mono">{formatChainId(clientStatus.config.chainId)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">App ID</p>
                <p className="font-mono">{formatAppId(clientStatus.config.applicationId)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Cross-Origin Isolated</p>
                <p className={clientStatus.crossOriginIsolated ? "text-green-600" : "text-red-600"}>
                  {clientStatus.crossOriginIsolated ? "✓ Enabled" : "✗ Disabled"}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Faucet</p>
                <p className="text-xs truncate">{clientStatus.config.faucetUrl}</p>
              </div>
            </div>
            
            {clientStatus.lastError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{clientStatus.lastError}</p>
              </div>
            )}
            
            {!clientStatus.crossOriginIsolated && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  Cross-origin isolation is required for SharedArrayBuffer support. 
                  Check COOP/COEP headers in vite.config.ts.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Counter Demo Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Counter Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Counter Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {counterValue}
              </div>
              <p className="text-sm text-muted-foreground">
                Current counter value from microchain
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => executeOperation('increment')}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '+1'}
              </Button>
              
              <Button
                onClick={() => executeOperation('decrement')}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '-1'}
              </Button>
              
              <Button
                onClick={() => executeOperation('reset')}
                disabled={isLoading}
                variant="destructive"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset'}
              </Button>
            </div>

            {/* Manual Refresh */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshCounter}
                disabled={isLoading}
                className="text-muted-foreground"
              >
                🔄 Refresh State
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <p><strong>1. Check Connection:</strong> Ensure "Connected" status appears above</p>
              <p><strong>2. Test Write Operations:</strong> Click +1, -1, or Reset buttons</p>
              <p><strong>3. Verify Read Operations:</strong> Counter should update after each mutation</p>
              <p><strong>4. Monitor Network:</strong> Check browser DevTools for GraphQL queries</p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700">
                <strong>Wave-1 Status:</strong> Currently using mock operations. 
                Replace placeholders with real Chain ID and App ID after deployment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}