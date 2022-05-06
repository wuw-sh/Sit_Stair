import { Client, Player } from './beapi_modules/BEAPI_CORE_SCRIPT.js';
import { Location } from "mojang-minecraft";
const client = new Client();
client.on('ItemInteract', data => {
    const bl = data.block, pl = data.source instanceof Player ? data.source : null, blLo = data.blockLocation, vector = new Location(blLo.x, blLo.y, blLo.z);
    if (bl.getId() === 'minecraft:oak_stairs' && !pl.hasTag('sit')) {
        if (!pl.executeCommand(`testfor @e[type=sit:sit,tag=${pl.getName()}]`).err)
            return;
        pl.teleportFacing(vector, pl.getDimensionName(), vector);
        client.world.spawnEntity('sit:sit', vector, pl.getDimensionName()).addTag(pl.getName());
        pl.executeCommand(`ride @s start_riding @e[type=sit:sit,c=1,tag=${pl.getName()}] teleport_rider`);
    }
});
client.on('Tick', () => {
    client.entities.getAllAsArray().map(e => {
        const et = e.getId() === 'sit:sit' ? e : null, getBlock = client.world.getBlock(et.getLocation(), et.getDimensionName()).getId() === 'minecraft:air' ? true : false;
        if (getBlock) {
            et.triggerEvent('despawn');
        }
    });
});
