<script lang="ts">
  import { Card } from '$lib/components/ui/card';
  import HugeIcon from '$lib/components/ui/icon/HugeIcon.svelte';
  import { Folder01Icon } from '@hugeicons/core-free-icons';

  const items = [
    {
      id: 'SUB-18485',
      imageKey: '29b2dbe5-186c-41b2-ac22-a9e95acf8fb5.jpeg',
      citizen: 'Rahul Verma',
      detected: 'Plastic (PET)',
      conf: '64.8%',
      threshold: '75%',
      bin: '#BLR-MG-04'
    },
    {
      id: 'SUB-18480',
      imageKey: '30b1ef94-074d-4aaa-8e82-79128578c980.jpeg',
      citizen: 'Divya Krishnan',
      detected: 'E-Waste (Li-Ion)',
      conf: '58.4%',
      threshold: '85%',
      bin: '#BLR-WF-11'
    },
    {
      id: 'SUB-18475',
      imageKey: '488af708-ae14-4500-825d-28b45560d8bb.jpeg',
      citizen: 'Pooja Iyer',
      detected: 'Paper & Cardboard',
      conf: '61.2%',
      threshold: '70%',
      bin: '#BLR-IN-02'
    },
    {
      id: 'SUB-18460',
      imageKey: '5be285de-71bd-4fb5-8587-c6f8958c7639.jpeg',
      citizen: 'Meera Swaminathan',
      detected: 'Glass Containers',
      conf: '62.7%',
      threshold: '80%',
      bin: '#BLR-KR-03'
    }
  ];
</script>

<svelte:head>
  <title>Low Confidence Captures — T2T Reviewer</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-xl font-bold tracking-tight text-zinc-900">Low Confidence Vision Submissions (&lt; 75%)</h1>
    <p class="text-xs text-zinc-500 mt-0.5">Captures falling below YOLOv8 automated confidence gates, routed for mandatory human oversight.</p>
  </div>

  <Card class="bg-white border-zinc-200 p-4 shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-zinc-200 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            <th class="py-2.5 px-3">Photo Preview</th>
            <th class="py-2.5 px-3">Capture ID</th>
            <th class="py-2.5 px-3">Citizen</th>
            <th class="py-2.5 px-3">Vision AI Guess</th>
            <th class="py-2.5 px-3">Model Confidence</th>
            <th class="py-2.5 px-3">Required Gate</th>
            <th class="py-2.5 px-3">Smart Bin</th>
            <th class="py-2.5 px-3 text-right">Adjudicate</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 font-mono text-[11px]">
          {#each items as it}
            <tr class="hover:bg-zinc-50 transition-colors">
              <td class="py-2.5 px-3">
                <a href="/api/images/{it.imageKey}" target="_blank" class="block w-10 h-10 rounded border border-zinc-200 overflow-hidden bg-zinc-100 hover:opacity-80">
                  <img src="/api/images/{it.imageKey}" alt="" class="w-full h-full object-cover" />
                </a>
              </td>
              <td class="py-3 px-3 font-semibold text-zinc-900">{it.id}</td>
              <td class="py-3 px-3 font-sans font-medium text-xs text-zinc-900">{it.citizen}</td>
              <td class="py-3 px-3 font-sans text-xs text-zinc-700">{it.detected}</td>
              <td class="py-3 px-3 text-amber-700 font-bold">{it.conf}</td>
              <td class="py-3 px-3 text-zinc-500">{it.threshold}</td>
              <td class="py-3 px-3 text-zinc-600">{it.bin}</td>
              <td class="py-3 px-3 text-right font-sans">
                <a href="/reviewer" class="inline-flex items-center text-[11px] h-6 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded font-medium">
                  Review
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
