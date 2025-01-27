
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    
    const { files, receiveAddress, fee } = await req.json();
    
    if (!files || !files.length) {
      return new NextResponse(JSON.stringify({ error: 'No files uploaded' }), { status: 400 });
    }

    const file = files[0];
    const { name, dataURL, type } = file;
       

   
    const base64Data = dataURL.split(',')[1]; 
    
    const payload={
     
        files:[
            {
                size: 951,
                type:type,
                name:name,
                dataURL:`data:${file.type};base64,${base64Data}`,

            }

        ],
        "lowPostage": true,
        "receiveAddress": receiveAddress,
        "fee": fee

    }

    const apiResponse = await fetch('https://testnet-api.ordinalsbot.com/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();


    return new NextResponse(JSON.stringify(apiData), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
